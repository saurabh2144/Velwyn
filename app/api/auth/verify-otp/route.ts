import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';
import { otpService } from '@/lib/otpService';

export const POST = async (request: NextRequest) => {
  const { email, otp } = await request.json();

  console.log('🔐 OTP Verification Request:', { email, otp });

  if (!email || !otp) {
    console.log('❌ Missing email or OTP');
    return Response.json(
      { message: 'Email and OTP are required' },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    // Debug: Check OTP storage before verification
   
    await otpService.debugOTPStorage();

    // Verify OTP from database
    const verificationResult = await otpService.verifyOTP(email, otp);


    if (!verificationResult.success) {
      return Response.json(
        { 
          message: verificationResult.message,
          remainingAttempts: await otpService.getRemainingAttempts(email)
        },
        { status: 400 }
      );
    }

    // OTP verified successfully, now create user in database
    const { userData } = verificationResult;

    // Final check if user already exists (race condition)
    const existingUser = await UserModel.findOne({ email, verified: true });
    if (existingUser) {
   


      return Response.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create verified user in database
    const newUser = new UserModel({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      isAdmin: false,
      verified: true,
    });

    await newUser.save();

    console.log('✅ User verified and created successfully:', email);

    return Response.json(
      { 
        message: 'Email verified successfully! You can now login.',
        success: true
      },
      { status: 200 }
    );

  } catch (err: any) {
    console.error('❌ OTP verification error:', err);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
};