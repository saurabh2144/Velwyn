'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, ValidationRule, useForm } from 'react-hook-form';

import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { ShippingAddress } from '@/lib/hooks/useBuyNowStore';

const Form = () => {
  const router = useRouter();
  const { saveShippingAddress, shippingAddress } = useCartService();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  });

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    saveShippingAddress(form);
    router.push('/payment');
  };

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof ShippingAddress;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div className='mb-3'>
      <label className='block text-gray-700 font-medium mb-1' htmlFor={id}>
        {name}
      </label>
      <input
        type='text'
        id={id}
        {...register(id, {
          required: required && `${name} is required`,
          pattern,
        })}
        className='input input-bordered w-full sm:max-w-md px-3 py-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all'
      />
      {errors[id]?.message && (
        <div className='text-red-500 text-sm mt-1'>{errors[id]?.message}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <CheckoutSteps current={1} />

      <div className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto my-8">
        <div className="card bg-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 rounded-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Shipping Address</h1>
              <p className="text-blue-100 text-sm mt-1">Where should we deliver your order?</p>
            </div>
          </div>

          {/* Form */}
          <div className="card-body p-6">
            <form onSubmit={handleSubmit(formSubmit)} className="space-y-4">

              <FormInput name='Full Name' id='fullName' required />
              <FormInput name='Address' id='address' required />

              {/* City & Postal Code Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput name='City' id='city' required />
                <FormInput name='Postal Code' id='postalCode' required />
              </div>

              <FormInput name='Country' id='country' required />

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isSubmitting}
                className='btn btn-primary w-full bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2'
              >
                {isSubmitting ? (
                  <>
                    <span className='loading loading-spinner loading-sm' />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>


            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
