'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Form = () => {
  const { data: session } = useSession();
  const params = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValue, setOtpValue] = useState('');

  let callbackUrl = params.get('callbackUrl') || '/';

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, params, router, session]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset OTP digits when OTP screen opens
  useEffect(() => {
    if (otpSent) {
      setOtpDigits(['', '', '', '', '', '']);
      setOtpValue('');
      // Focus first input after a small delay
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [otpSent]);

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);

      // Update the OTP value
      const newOtpValue = newOtpDigits.join('');
      setOtpValue(newOtpValue);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 6);
      const filledOtp = [...newOtp, ...Array(6 - newOtp.length).fill('')];
      setOtpDigits(filledOtp);
      setOtpValue(newOtp.join(''));
      
      // Focus last filled input
      const lastFilledIndex = Math.min(newOtp.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  // Fixed ref callback function
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    setIsLoading(true);
    const { name, email, password } = form;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setOtpSent(true);
        setUserEmail(email);
        setCountdown(600); // 10 minutes
        toast.success('OTP sent to your email!');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      const error =
        err.message && err.message.indexOf('E11000') === 0
          ? 'Email is already registered'
          : err.message;
      toast.error(error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const otpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate OTP
    if (otpValue.length !== 6 || !/^\d+$/.test(otpValue)) {
      toast.error('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          otp: otpValue,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Email verified successfully!');
        router.push('/signin?success=Registration completed. Please login.');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) {
      toast.error(`Please wait ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')} before resending OTP`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setCountdown(600); // 10 minutes
        toast.success('New OTP sent successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Screen
  if (otpSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl text-white">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h1>
            <p className="text-gray-600">We've sent a 6-digit OTP to your email</p>
            <p className="text-sm text-gray-500 mt-1">{userEmail}</p>
          </div>

          {/* OTP Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <form onSubmit={otpSubmit} className="space-y-6">
              {/* OTP Field - Completely clean inputs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6-Digit OTP
                </label>
                <div className="flex gap-2 justify-center mb-2">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={setInputRef(index)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className="w-12 h-12 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      placeholder="0"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
                
                {/* Error Message */}
                {otpValue.length > 0 && otpValue.length !== 6 && (
                  <div className="mt-2 flex items-center justify-center text-red-600 text-sm">
                    <span className="mr-1">⚠️</span>
                    OTP must be 6 digits
                  </div>
                )}
                
                {/* Helper Text */}
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  OTP expires in: <span className="font-semibold text-red-600">
                    {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </span>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || otpValue.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    Verify OTP
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={countdown > 0 || isLoading}
                  className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-medium transition-colors"
                >
                  {countdown > 0 ? `Resend OTP in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}` : 'Resend OTP'}
                </button>
              </div>

              {/* Back to Registration */}
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-xl font-medium transition-all duration-200"
              >
                ← Back to Registration
              </button>
            </form>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-blue-600 text-lg mb-2">⏱️</div>
              <h4 className="font-semibold text-gray-900">10 Min Expiry</h4>
              <p>OTP expires quickly</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-green-600 text-lg mb-2">🔒</div>
              <h4 className="font-semibold text-gray-900">Secure</h4>
              <p>One-time use</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-purple-600 text-lg mb-2">📧</div>
              <h4 className="font-semibold text-gray-900">Instant</h4>
              <p>Quick delivery</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original Registration Form (unchanged)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl text-white">📝</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Sign up to get started with our platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Success Message */}
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
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  {...register('name', {
                    required: 'Name is required',
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                    errors.name 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Enter your full name"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-gray-400">👤</span>
                </div>
              </div>
              {errors.name?.message && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <span className="mr-1">⚠️</span>
                  {errors.name.message}
                </div>
              )}
            </div>

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
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  {...register('confirmPassword', {
                    required: 'Confirm Password is required',
                    validate: (value) => {
                      const { password } = getValues();
                      return password === value || 'Passwords should match!';
                    },
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:ring-red-200' 
                      : 'border-gray-300 focus:ring-blue-200'
                  }`}
                  placeholder="Confirm your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              {errors.confirmPassword?.message && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <span className="mr-1">⚠️</span>
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending OTP...
                </>
              ) : (
                <>
                  <span>📝</span>
                  Create your account
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link 
                href={`/signin?callbackUrl=${callbackUrl}`}
                className="inline-flex items-center gap-2 w-full justify-center py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
              >
                <span>🔑</span>
                Sign in to your account
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
            <p>OTP verification</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-green-600 text-lg mb-2">⚡</div>
            <h4 className="font-semibold text-gray-900">Fast</h4>
            <p>Quick setup</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-purple-600 text-lg mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900">Easy</h4>
            <p>Simple registration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;