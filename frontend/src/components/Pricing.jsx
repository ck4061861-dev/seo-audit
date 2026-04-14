import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PACKAGES = [
  {
    name: 'Starter',
    monthly: 9,
    yearly: 90,
    monthlyFeatures: ['10 audits / month', 'Basic report', 'Email support', '1 user'],
    yearlyFeatures: ['100 audits / year', 'Basic report', 'Email support', '1 user'],
  },
  {
    name: 'Growth',
    monthly: 19,
    yearly: 190,
    monthlyFeatures: ['50 audits / month', 'PDF reports', 'Priority support', '5 users'],
    yearlyFeatures: ['500 audits / year', 'PDF reports', 'Priority support', '5 users'],
  },
  {
    name: 'Pro',
    monthly: 49,
    yearly: 490,
    monthlyFeatures: ['140 audits / month', 'Advanced insights', 'Dedicated manager', '10 users'],
    yearlyFeatures: ['1400 audits / year', 'Advanced insights', 'Dedicated manager', '10 users'],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState('monthly');
  const [loadingPkg, setLoadingPkg] = useState(null);
  const [message, setMessage] = useState('');
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(83); // Default fallback
  const [loadingRate, setLoadingRate] = useState(true);
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

  // ─────────────────────────────────────────
  // Fetch live exchange rate on component mount
  // ─────────────────────────────────────────
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Try primary API first
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        if (data.rates && data.rates.INR) {
          const rate = Math.round(data.rates.INR * 100) / 100;
          setExchangeRate(rate);
          console.log('✅ Exchange rate updated:', rate);
        }
      } catch (primaryError) {
        console.warn('Primary API failed, trying backup...', primaryError);
        
        // Fallback API
        try {
          const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=INR');
          const data = await response.json();
          
          if (data.rates && data.rates.INR) {
            const rate = Math.round(data.rates.INR * 100) / 100;
            setExchangeRate(rate);
            console.log('✅ Exchange rate updated (backup):', rate);
          }
        } catch (backupError) {
          console.warn('Both APIs failed, using fallback rate', backupError);
          // Keep default rate (83) on error
        }
      } finally {
        setLoadingRate(false);
      }
    };

    fetchExchangeRate();
  }, []);

  // Helper function to convert USD to INR
  const USD_TO_INR = (usd) => Math.round(usd * exchangeRate);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const refreshAccessToken = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/api/auth/user/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Session expired. Please login again.');
    }
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    }
    throw new Error('Unable to refresh session. Please login again.');
  };

  const postWithRefresh = async (url, body) => {
    const API_URL = import.meta.env.VITE_API_URL;
    let token = localStorage.getItem('accessToken');

    const makeCall = async (authToken) =>
      fetch(`${API_URL}${url}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      });

    let res = await makeCall(token);
    if (res.status === 401) {
      token = await refreshAccessToken();
      res = await makeCall(token);
    }
    return res;
  };

  const purchase = async (packageName, amountUSD) => {
    if (!user) {
      navigate('/user-login');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setMessage('Session expired. Please login again.');
      return;
    }

    // Convert USD to INR and show modal
    const amountINR = USD_TO_INR(amountUSD);
    setPendingPayment({ packageName, amountUSD, amountINR });
    setShowConversionModal(true);
  };

  const proceedWithPayment = async (packageName, amountUSD, amountINR) => {
    setLoadingPkg(packageName);
    try {
      const orderRes = await postWithRefresh('/api/payments/create-order', { amount: amountINR });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.message || 'Order creation failed');
      }

      const razorpayReady = await loadRazorpayScript();
      if (!razorpayReady) throw new Error('Razorpay SDK failed to load');

      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'SeoAuditor Premium',
        description: `${packageName} plan purchase (${amountUSD} USD = ${amountINR} INR)`,
        order_id: orderData.order.id,
        prefill: {
          name: user.name,
          email: user.email,
          // contact: '' -- Removed so user must enter phone number each time
        },
        handler: async function (response) {
          const verifyData = {
            ...response,
            amount: amountINR,
            billingPeriod: billing === 'monthly' ? 'Monthly' : 'Yearly',
          };
          const verifyRes = await postWithRefresh('/api/payments/verify', verifyData);
          const verifyResData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyResData.message || 'Payment verification failed');

          const updated = { 
            ...user, 
            premium: true, 
            plan: packageName,
            billingPeriod: billing === 'monthly' ? 'Monthly' : 'Yearly',
            auditsUsed: 0,
          };
          localStorage.setItem('user', JSON.stringify(updated));
          setMessage(`${packageName} ${billing === 'monthly' ? 'monthly' : 'yearly'} plan activated successfully!`);
        },
        theme: { color: '#a90006' },
        modal: { ondismiss: () => setMessage('Payment flow closed.') },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      setMessage(err.message || 'Payment failed');
    } finally {
      setLoadingPkg(null);
      setShowConversionModal(false);
      setPendingPayment(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">Pricing plans</h1>
          <p className="text-gray-500 mt-3">Choose a plan that matches your growth stage and team size.</p>
        </div>

        <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 mb-12">
          <button
            className={`px-5 py-2 rounded-full font-semibold ${billing === 'monthly' ? 'bg-[#a90006] text-white' : 'text-gray-600'}`}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-5 py-2 rounded-full font-semibold ${billing === 'yearly' ? 'bg-[#a90006] text-white' : 'text-gray-600'}`}
            onClick={() => setBilling('yearly')}
          >
            Yearly (save 2 months)
          </button>
        </div>

        {/* Live Exchange Rate Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PACKAGES.map((pkg) => (
            <div key={pkg.name} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900">{pkg.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{billing === 'monthly' ? 'Pay monthly' : 'Pay yearly'}</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-[#a90006]">${billing === 'monthly' ? pkg.monthly : pkg.yearly}</span>
                <span className="text-sm text-gray-500">/{billing === 'monthly' ? 'month' : 'year'}</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                {(billing === 'monthly' ? pkg.monthlyFeatures : pkg.yearlyFeatures).map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-green-500">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => purchase(pkg.name, billing === 'monthly' ? pkg.monthly : pkg.yearly)}
                disabled={loadingPkg === pkg.name}
                className="w-full bg-[#a90006] text-white rounded-lg py-2.5 font-semibold hover:bg-[#8a0005] transition-colors disabled:opacity-50"
              >
                {loadingPkg === pkg.name ? 'Processing...' : `Upgrade to ${pkg.name}`}
              </button>
            </div>
          ))}
        </div>

        {message && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="mt-10 text-sm text-gray-500">
          <p className="mb-1">Need more? Contact us for enterprise plans with custom audit quota, API access, and onboarding.</p>
          <p>Email: <a href="mailto:sales@buimbdigital.com" className="text-[#a90006]">sales@buimbdigital.com</a></p>
        </div>
      </div>

      {/* Conversion Modal */}
      {showConversionModal && pendingPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Confirm Payment</h3>
              {loadingRate && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full animate-pulse">
                  Updating rate...
                </span>
              )}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold text-gray-900">Plan:</span> {pendingPayment.packageName} ({billing === 'monthly' ? 'Monthly' : 'Yearly'})
              </p>
              
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-200">
                <span className="text-sm text-gray-600">Price in USD:</span>
                <span className="text-lg font-bold text-[#a90006]">${pendingPayment.amountUSD}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Price in INR (₹):</span>
                <span className="text-lg font-bold text-[#a90006]">₹{pendingPayment.amountINR}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                <span className="text-xs text-gray-500">Live Rate:</span>
                <span className="text-sm font-semibold text-gray-700">1 USD = ₹{exchangeRate}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              You will be charged <span className="font-bold text-[#a90006]">₹{pendingPayment.amountINR}</span> on your payment method.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConversionModal(false);
                  setPendingPayment(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => proceedWithPayment(pendingPayment.packageName, pendingPayment.amountUSD, pendingPayment.amountINR)}
                disabled={loadingPkg === pendingPayment.packageName}
                className="flex-1 px-4 py-2 rounded-lg bg-[#a90006] text-white font-medium hover:bg-[#8a0005] transition disabled:opacity-50"
              >
                {loadingPkg === pendingPayment.packageName ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
