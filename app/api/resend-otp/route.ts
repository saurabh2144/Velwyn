import { otpService } from '@/lib/otpService';
import { NextRequest } from 'next/server';
import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY!);

export const POST = async (request: NextRequest) => {
  const { email } = await request.json();
  if (!email) {
    return Response.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const resendResult = await otpService.resendOTP(email);
    if (!resendResult.success) {
      return Response.json({ message: resendResult.message }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: 'Velwyn <noreply@velwyn.in>', // ⚠️ might cause spam — explained below
      to: [email],
      subject: `Your New Verification OTP - Velwyn`,
      html: `<p>Your new OTP is <b>${resendResult.otp}</b></p>`,
    });

    if (error) {
      console.error(error);
      return Response.json({ message: 'Failed to send OTP email' }, { status: 500 });
    }

    return Response.json({ message: 'New OTP sent successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
};
