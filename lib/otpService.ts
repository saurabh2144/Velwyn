import OTPSchema from './models/OTPModel';

class MongoDBOTPService {
  private readonly OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ATTEMPTS = 3;

  generateOTP(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Generated OTP:', otp);
    return otp;
  }

  async storeOTP(
    email: string,
    userData: { name: string; email: string; password: string }
  ): Promise<{ success: boolean; otp?: string; message?: string }> {
    try {
      console.log('📦 Storing OTP for:', email);
      await OTPSchema.deleteOne({ email });

      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MS);

      await OTPSchema.create({
        email,
        otp,
        userData,
        expiresAt,
        attempts: 0,
      });

      console.log('✅ OTP stored in database for:', email, 'OTP:', otp);
      return { success: true, otp };
    } catch (error) {
      console.error('❌ Error storing OTP:', error);
      return { success: false, message: 'Failed to generate OTP' };
    }
  }

  async verifyOTP(
    email: string,
    enteredOTP: string
  ): Promise<{ success: boolean; message: string; userData?: any }> {
    try {
      console.log('🔍 Verifying OTP for:', email);
      const otpRecord = await OTPSchema.findOne({ email });
      if (!otpRecord) return { success: false, message: 'OTP not found or expired' };

      if (otpRecord.expiresAt < new Date()) {
        await OTPSchema.deleteOne({ email });
        return { success: false, message: 'OTP has expired' };
      }

      if (otpRecord.attempts >= this.MAX_ATTEMPTS) {
        await OTPSchema.deleteOne({ email });
        return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
      }

      if (otpRecord.otp !== enteredOTP) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        const remainingAttempts = this.MAX_ATTEMPTS - otpRecord.attempts;
        const message =
          remainingAttempts > 0
            ? `Invalid OTP. ${remainingAttempts} attempts remaining.`
            : 'Too many failed attempts. Please request a new OTP.';
        return { success: false, message };
      }

      const userData = otpRecord.userData;
      await OTPSchema.deleteOne({ email });
      console.log('✅ OTP verified successfully for:', email);
      return { success: true, message: 'OTP verified successfully', userData };
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      return { success: false, message: 'Internal server error during OTP verification' };
    }
  }

  async resendOTP(
    email: string
  ): Promise<{ success: boolean; otp?: string; message?: string }> {
    try {
      console.log('🔄 Resending OTP for:', email);
      let otpRecord = await OTPSchema.findOne({ email });

      // If OTP not found, create a new one automatically
      if (!otpRecord) {
        console.log('⚠️ No OTP found. Creating a new one for resend.');
        const newOTP = this.generateOTP();
        const newExpiresAt = new Date(Date.now() + this.OTP_EXPIRY_MS);

        await OTPSchema.create({
          email,
          otp: newOTP,
          attempts: 0,
          expiresAt: newExpiresAt,
          userData: {},
        });

        console.log('✅ New OTP generated for resend:', newOTP);
        return { success: true, otp: newOTP, message: 'New OTP generated successfully.' };
      }

      // OTP exists, refresh it
      const newOTP = this.generateOTP();
      otpRecord.otp = newOTP;
      otpRecord.expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MS);
      otpRecord.attempts = 0;
      await otpRecord.save();

      console.log('✅ Existing OTP refreshed for resend:', newOTP);
      return { success: true, otp: newOTP, message: 'OTP resent successfully.' };
    } catch (error) {
      console.error('❌ Error resending OTP:', error);
      return { success: false, message: 'Failed to resend OTP' };
    }
  }

  // ✅ Newly added function to fix the build error
  async getRemainingAttempts(email: string): Promise<number> {
    try {
      const otpRecord = await OTPSchema.findOne({ email });
      if (!otpRecord) return this.MAX_ATTEMPTS;
      return this.MAX_ATTEMPTS - otpRecord.attempts;
    } catch (error) {
      console.error('❌ Error getting remaining attempts:', error);
      return this.MAX_ATTEMPTS;
    }
  }

  // Debug: see all OTPs in DB
  async debugOTPStorage() {
    try {
      const allOTPs = await OTPSchema.find({});
      console.log('🐛 OTP Storage Debug - Total entries:', allOTPs.length);
      allOTPs.forEach((otp) => {
        console.log(`📧 ${otp.email}:`, {
          otp: otp.otp,
          expiresAt: otp.expiresAt,
          attempts: otp.attempts,
        });
      });
    } catch (error) {
      console.error('❌ Error debugging OTP storage:', error);
    }
  }
}

export const otpService = new MongoDBOTPService();
