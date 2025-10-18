import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return Response.redirect(`${process.env.NEXTAUTH_URL}/signin?error=Invalid verification token`);
  }

  await dbConnect();

  try {
    // Find user with valid verification token
    const user = await UserModel.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return Response.redirect(`${process.env.NEXTAUTH_URL}/signin?error=Invalid or expired verification token`);
    }

    // Update user as verified
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    return Response.redirect(`${process.env.NEXTAUTH_URL}/signin?success=Email verified successfully. You can now login.`);

  } catch (err: any) {
    console.error('Verification error:', err);
    return Response.redirect(`${process.env.NEXTAUTH_URL}/signin?error=Verification failed`);
  }
};