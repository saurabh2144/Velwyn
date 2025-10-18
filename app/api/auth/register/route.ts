import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';
import { otpService } from '@/lib/otpService';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();
  
  console.log('🚀 Registration attempt for:', email);
  
  await dbConnect();

  try {
    // Check if user already exists (verified)
    const existingUser = await UserModel.findOne({ email, verified: true });
    if (existingUser) {
      console.log('❌ Verified user already exists:', email);
      return Response.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Delete any existing unverified user (cleanup)
    await UserModel.findOneAndDelete({ email, verified: false });

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate and store OTP in database
    const otpResult = await otpService.storeOTP(email, {
      name,
      email,
      password: hashedPassword
    });

    // Debug: Check OTP storage
    console.log('🐛 After OTP storage - OTP Result:', otpResult);
    await otpService.debugOTPStorage();

    if (!otpResult.success) {
      return Response.json(
        { message: otpResult.message },
        { status: 400 }
      );
    }

    console.log('📧 Sending OTP to:', email);
    console.log('🔢 OTP to send:', otpResult.otp);

    // Send OTP email
    const { error } = await resend.emails.send({
      from: 'Velwyn <noreply@velwyn.in>',
      to: [email],
      subject: `Your Verification OTP - Velwyn`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🔐 Verify Your Email</h1>
          </div>
          
          <p style="font-size: 16px; color: #374151;">Hello <strong>${name}</strong>,</p>
          
          <p style="font-size: 16px; color: #374151;">
            Thank you for registering with Velwyn <h1 style="font-size: 18px; color: #0c0c0cff;">Where Luxury Meets Value </h1>Use the OTP below to verify your email address:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="background-color: #2563eb; color: white; padding: 20px; 
                      border-radius: 12px; font-size: 32px; font-weight: 700; 
                      letter-spacing: 8px; display: inline-block;">
              ${otpResult.otp}
            </div>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            This OTP will expire in 10 minutes.
          </p>
          
          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>Note:</strong> Do not share this OTP with anyone.
            </p>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 14px; color: #6b7280; margin: 0;">
              Best regards,<br>
              <strong>The Velwyn Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
      return Response.json(
        { 
          message: 'Failed to send OTP. Please try again.',
          error: error.message
        },
        { status: 500 }
      );
    }

    console.log('✅ OTP sent successfully to:', email);
    return Response.json(
      { 
        message: 'OTP sent successfully. Please check your email.',
        email: email
      },
      { status: 200 }
    );

  } catch (err: any) {
    console.error('❌ Registration error:', err);
    
    if (err.code === 11000) {
      return Response.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }
    
    return Response.json(
      { message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
};