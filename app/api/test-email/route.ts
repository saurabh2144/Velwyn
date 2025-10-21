import { NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export const POST = async (request: NextRequest) => {
  const { email } = await request.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ["contact.velwyn@gmail.com"],
      subject: 'Test Email from Velwyn',
      html: '<p>This is a test email to verify Resend is working well!</p>',
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ 
      message: 'Test email sent successfully!',
      data 
    }, { status: 200 });

  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};