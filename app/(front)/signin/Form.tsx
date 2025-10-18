'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Inputs = {
  email: string;
  password: string;
};

const Form = () => {
  const params = useSearchParams();
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  let callbackUrl = params.get('callbackUrl') || '/';
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const emailValue = watch('email');

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, router, session, params]);

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    setIsLoading(true);
    const { email, password } = form;
    
    // Store email in localStorage for potential resend verification
    if (email) {
      localStorage.setItem('signinEmail', email);
    }
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      if (result.error === 'EMAIL_NOT_VERIFIED') {
        toast.error('Please verify your email before logging in.');
      } else {
        toast.error('Invalid email or password');
      }
    }
    
    setIsLoading(false);
  };

  const resendVerification = async () => {
    const emailToResend = emailValue || localStorage.getItem('signinEmail');
    
    if (!emailToResend) {
      toast.error('Please enter your email address first');
      return;
    }

    setResendLoading(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToResend }),
      });

      if (res.ok) {
        toast.success('Verification email sent! Please check your inbox.');
      } else {
        const data = await res.json();
        throw new Error(data.message || 'Failed to resend verification email');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl text-white">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Alert Messages */}
          {params.get('error') && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="text-red-500 text-lg mr-3">⚠️</div>
                <div>
                  <h3 className="text-red-800 font-semibold">Sign in failed</h3>
                  <p className="text-red-600 text-sm">
                    {params.get('error') === 'CredentialsSignin'
                      ? 'Invalid email or password. Please try again.'
                      : params.get('error') === 'EMAIL_NOT_VERIFIED'
                      ? 'Please verify your email before logging in. Check your inbox for verification link.'
                      : params.get('error')}
                  </p>
                  {params.get('error') === 'EMAIL_NOT_VERIFIED' && (
                    <div className="mt-3">
                      <button
                        onClick={resendVerification}
                        disabled={resendLoading}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        {resendLoading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <span>🔄</span>
                            Resend verification email
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {params.get('success') && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="text-green-500 text-lg mr-3">✅</div>
                <div>
                  <h3 className="text-green-800 font-semibold">Success!</h3>
                  <p className="text-green-600 text-sm">{params.get('success')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(formSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-gray-400">📧</span>
                </div>
              </div>
              {errors.email?.message && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <span className="mr-1">⚠️</span>
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              {errors.password?.message && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <span className="mr-1">⚠️</span>
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              {(isSubmitting || isLoading) ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <span>🔑</span>
                  Sign in to your account
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to our platform?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link 
                href={`/register?callbackUrl=${callbackUrl}`}
                className="inline-flex items-center gap-2 w-full justify-center py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
              >
                <span>📝</span>
                Create new account
              </Link>
            </div>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>🏠</span>
              Return to home page
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-blue-600 text-lg mb-2">🔒</div>
            <h4 className="font-semibold text-gray-900">Secure</h4>
            <p>Your data is protected</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-green-600 text-lg mb-2">⚡</div>
            <h4 className="font-semibold text-gray-900">Fast</h4>
            <p>Quick access</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-purple-600 text-lg mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900">Easy</h4>
            <p>Simple to use</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;