'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';

const Form = () => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const { savePaymentMethod, paymentMethod, shippingAddress } =
    useCartService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentMethod(selectedPaymentMethod);
    router.push('/place-order');
  };

  useEffect(() => {
    if (!shippingAddress) {
      return router.push('/shipping');
    }
    // Default payment method Razorpay
    setSelectedPaymentMethod(paymentMethod || 'Razorpay');
  }, [paymentMethod, router, shippingAddress]);

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
    <CheckoutSteps current={2} />
    
    <div className="max-w-md mx-auto my-8">
      <div className="card bg-white shadow-2xl border-0 hover:shadow-3xl transition-all duration-500">
        <div className="card-body p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Method</h1>
            <p className="text-gray-600">Choose how you'd like to pay</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Payment Options */}
            <div className="space-y-4 mb-8">
              {['Razorpay', 'CashOnDelivery'].map((payment) => (
                <div 
                  key={payment} 
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                    selectedPaymentMethod === payment 
                      ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105' 
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedPaymentMethod(payment)}
                >
                  <label className='flex items-center justify-between cursor-pointer'>
                    <div className="flex items-center space-x-4">
                      {/* Payment Icons */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        payment === 'Razorpay' 
                          ? 'bg-orange-100 text-orange-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {payment === 'Razorpay' ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        )}
                      </div>
                      
                      <div>
                        <span className='label-text font-semibold text-gray-800 text-lg'>{payment}</span>
                        <p className="text-sm text-gray-500 mt-1">
                          {payment === 'Razorpay' 
                            ? 'Pay securely with UPI, Cards & Net Banking' 
                            : 'Pay when your order is delivered'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <input
                      type='radio'
                      name='paymentMethod'
                      className='radio radio-primary'
                      value={payment}
                      checked={selectedPaymentMethod === payment}
                      onChange={() => setSelectedPaymentMethod(payment)}
                    />
                  </label>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                type='submit' 
                className='btn btn-primary w-full bg-gradient-to-r from-blue-500 to-purple-600 border-0 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg py-4 text-lg font-semibold'
                disabled={!selectedPaymentMethod}
              >
                {selectedPaymentMethod === 'CashOnDelivery' ? 'Continue to Review' : 'Proceed to Payment'}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <button
                type='button'
                className='btn btn-outline w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 transition-all duration-300 py-4'
                onClick={() => router.back()}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Shipping
              </button>
            </div>
          </form>

          {/* Security Badge */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Form;
