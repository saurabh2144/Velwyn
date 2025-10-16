'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
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

  let callbackUrl = params.get('callbackUrl') || '/';

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, params, router, session]);

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
      if (res.ok) {
        return router.push(
          `/signin?callbackUrl=${callbackUrl}&success=Account has been created`,
        );
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (err: any) {
      const error =
        err.message && err.message.indexOf('E11000') === 0
          ? 'Email is duplicate'
          : err.message;
      toast.error(error || 'error');
    } finally {
      setIsLoading(false);
    }
  };

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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              {(isSubmitting || isLoading) ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
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
            <p>Your data is protected</p>
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