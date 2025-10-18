import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';

import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();
  
  console.log('🚀 Registration attempt for:', email);
  
  await dbConnect();

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return Response.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = uuidv4();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      verified: false,
      verificationToken,
      verificationExpires,
    });

    await newUser.save();
    console.log('✅ User created successfully:', email);

    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${verificationToken}`;
    
    console.log('📧 Sending verification email to:', email);
    console.log('🔗 Verification URL:', verificationUrl);

    // ✅ DOMAIN VERIFIED - Send to actual user email
    const { data, error } = await resend.emails.send({
      // 🎯 CHANGE 1: Use your verified domain email
      from: 'Velwyn <noreply@velwyn.in>',
      
      // 🎯 CHANGE 2: Send directly to user (no fallback needed)
      to: [email],
      
      subject: `Verify your email address - Velwyn`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🔐 Verify Your Email</h1>
          </div>
          
          <p style="font-size: 16px; color: #374151;">Hello <strong>${name}</strong>,</p>
          
          <p style="font-size: 16px; color: #374151;">
            Thank you for registering with Velwyn! To complete your account setup, please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #2563eb; color: white; padding: 14px 28px; 
                      text-decoration: none; border-radius: 8px; font-size: 16px; 
                      font-weight: 600; display: inline-block; border: none;">
              Verify Email Address
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          
          <p style="font-size: 14px; color: #2563eb; word-break: break-all; background-color: #f8fafc; padding: 12px; border-radius: 6px;">
            ${verificationUrl}
          </p>
          
          <p style="font-size: 14px; color: #6b7280;">
            This verification link will expire in 24 hours.
          </p>
          
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
          message: 'User created but verification email failed to send. Please try again or contact support.',
          error: error.message
        },
        { status: 201 }
      );
    }

    console.log('✅ Email sent successfully to:', email);
    return Response.json(
      { 
        message: 'User created successfully. Please check your email for verification instructions.',
        userId: newUser._id
      },
      { status: 201 }
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