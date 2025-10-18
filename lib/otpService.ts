import OTPSchema from './models/OTPModel';

class MongoDBOTPService {
  private readonly OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ATTEMPTS = 3;

  generateOTP(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Generated OTP:', otp);
    return otp;
  }

  async storeOTP(email: string, userData: { name: string; email: string; password: string }): Promise<{ success: boolean; otp?: string; message?: string }> {
    try {
      console.log('📦 Storing OTP for:', email);
      
      // Delete existing OTP for this email
      await OTPSchema.deleteOne({ email });
      
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MS);

      // Create new OTP in database
      await OTPSchema.create({
        email,
        otp,
        userData,
        expiresAt
      });

      console.log('✅ OTP stored in database for:', email, 'OTP:', otp);
      return { success: true, otp };
    } catch (error) {
      console.error('❌ Error storing OTP:', error);
      return { success: false, message: 'Failed to generate OTP' };
    }
  }

  async verifyOTP(email: string, enteredOTP: string): Promise<{ success: boolean; message: string; userData?: any }> {
    try {
      console.log('🔍 Verifying OTP for:', email);
      console.log('📨 Entered OTP:', enteredOTP);
      
      const otpRecord = await OTPSchema.findOne({ email });
      
      console.log('📂 Found OTP record:', otpRecord);

      if (!otpRecord) {
        console.log('❌ OTP not found for:', email);
        return { success: false, message: 'OTP not found or expired' };
      }

      if (otpRecord.expiresAt < new Date()) {
        console.log('❌ OTP expired for:', email);
        await OTPSchema.deleteOne({ email });
        return { success: false, message: 'OTP has expired' };
      }

      if (otpRecord.attempts >= this.MAX_ATTEMPTS) {
        console.log('❌ Too many attempts for:', email);
        await OTPSchema.deleteOne({ email });
        return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
      }

      console.log('🔐 Comparing OTPs - Stored:', otpRecord.otp, 'Entered:', enteredOTP);
      
      if (otpRecord.otp !== enteredOTP) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        
        console.log('❌ Invalid OTP. Attempt:', otpRecord.attempts);
        
        const remainingAttempts = this.MAX_ATTEMPTS - otpRecord.attempts;
        const message = remainingAttempts > 0 
          ? `Invalid OTP. ${remainingAttempts} attempts remaining.`
          : 'Too many failed attempts. Please request a new OTP.';

        return { success: false, message };
      }

      // OTP verified successfully
      console.log('✅ OTP verified successfully for:', email);
      const userData = otpRecord.userData;
      await OTPSchema.deleteOne({ email });
      
      return { 
        success: true, 
        message: 'OTP verified successfully',
        userData 
      };
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      return { success: false, message: 'Internal server error during OTP verification' };
    }
  }

  async getRemainingAttempts(email: string): Promise<number> {
    try {
      const otpRecord = await OTPSchema.findOne({ email });
      if (!otpRecord) return 0;
      return this.MAX_ATTEMPTS - otpRecord.attempts;
    } catch (error) {
      return 0;
    }
  }

  async resendOTP(email: string): Promise<{ success: boolean; otp?: string; message?: string }> {
    try {
      console.log('🔄 Resending OTP for:', email);
      
      const otpRecord = await OTPSchema.findOne({ email });
      
      if (!otpRecord) {
        console.log('❌ No OTP found to resend for:', email);
        return { success: false, message: 'No pending registration found. Please register again.' };
      }

      const newOTP = this.generateOTP();
      const newExpiresAt = new Date(Date.now() + this.OTP_EXPIRY_MS);
      
      // Update OTP and reset attempts
      otpRecord.otp = newOTP;
      otpRecord.expiresAt = newExpiresAt;
      otpRecord.attempts = 0;
      
      await otpRecord.save();

      console.log('✅ New OTP generated for resend:', newOTP);
      return { success: true, otp: newOTP };
    } catch (error) {
      console.error('❌ Error resending OTP:', error);
      return { success: false, message: 'Failed to resend OTP' };
    }
  }

  // Debug method to see all stored OTPs
  async debugOTPStorage() {
    try {
      const allOTPs = await OTPSchema.find({});
      console.log('🐛 OTP Storage Debug:');
      console.log('Total entries:', allOTPs.length);
      allOTPs.forEach(otp => {
        console.log(`📧 ${otp.email}:`, {
          otp: otp.otp,
          expiresAt: otp.expiresAt,
          attempts: otp.attempts
        });
      });
    } catch (error) {
      console.error('❌ Error debugging OTP storage:', error);
    }
  }
}

export const otpService = new MongoDBOTPService();