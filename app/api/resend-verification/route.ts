import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request: NextRequest) => {
  const { email } = await request.json();

  if (!email) {
    return Response.json(
      { message: 'Email is required' },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.verified) {
      return Response.json(
        { message: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const newVerificationToken = uuidv4();
    const newVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update user with new token
    user.verificationToken = newVerificationToken;
    user.verificationExpires = newVerificationExpires;
    await user.save();

    // Send new verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${newVerificationToken}`;

    // ✅ DOMAIN VERIFIED - Send to actual user email
    const { error } = await resend.emails.send({
      from: 'Velwyn <noreply@velwyn.in>', // Updated to your domain
      to: [email], // Send to actual user email
      subject: `Verify your email address - Velwyn`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🔄 Verify Your Email</h1>
          </div>
          
          <p style="font-size: 16px; color: #374151;">Hello <strong>${user.name}</strong>,</p>
          
          <p style="font-size: 16px; color: #374151;">
            We received a request to resend the verification email. Please click the button below to verify your email address:
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
      console.error('Resend error:', error);
      return Response.json(
        { message: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return Response.json(
      { message: 'Verification email sent successfully' },
      { status: 200 }
    );

  } catch (err: any) {
    console.error('Resend verification error:', err);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
};