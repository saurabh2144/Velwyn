import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { otpService } from '@/lib/otpService';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request: NextRequest) => {
  const { email } = await request.json();

  if (!email) {
    return Response.json(
      { message: 'Email is required' },
      { status: 400 }
    );
  }

  try {
    // Resend OTP - Now async
    const resendResult = await otpService.resendOTP(email);

    console.log('🔄 Resend OTP Result:', resendResult);

    if (!resendResult.success) {
      return Response.json(
        { message: resendResult.message },
        { status: 400 }
      );
    }

    // Get user name from OTP record for personalized email
    let userName = 'User';
    try {
      // We can get user data from the OTP record if needed
      // For now, we'll use a generic name
    } catch (error) {
      console.log('⚠️ Could not get user name, using default');
    }

    // Send new OTP email
    const { error } = await resend.emails.send({
      from: 'Velwyn <noreply@velwyn.in>',
      to: [email],
      subject: `Your New Verification OTP - Velwyn`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🔄 New OTP</h1>
          </div>
          
          <p style="font-size: 16px; color: #374151;">Hello,</p>
          
          <p style="font-size: 16px; color: #374151;">
            Here is your new verification OTP:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <div style="background-color: #2563eb; color: white; padding: 20px; 
                      border-radius: 12px; font-size: 32px; font-weight: 700; 
                      letter-spacing: 8px; display: inline-block;">
              ${resendResult.otp}
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
      console.error('❌ Resend OTP email error:', error);
      return Response.json(
        { message: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    console.log('✅ New OTP sent to:', email);
    return Response.json(
      { message: 'New OTP sent successfully' },
      { status: 200 }
    );

  } catch (err: any) {
    console.error('❌ Resend OTP error:', err);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
};