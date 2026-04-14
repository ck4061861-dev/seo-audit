import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAvatar } from '../utils/avatarUtils';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed?.role === 'admin') {
        navigate('/admin');
        return;
      }
      const fallbackName = parsed.name || (parsed.email ? parsed.email.split('@')[0] : 'User');
      setUser({ ...parsed, name: fallbackName });
    } catch (err) {
      console.error('Profile parse error', err);
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading user profile...</p>
      </div>
    );
  }

  if (user.blocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center rounded-xl border border-red-200 bg-red-50 p-8">
          <h2 className="text-xl font-bold text-red-700">Account Blocked</h2>
          <p className="mt-2 text-sm text-red-600">You are blocked. Contact sales@buimbdigital.com for support.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { name, email, role, phone, organization, premium, plan, auditsUsed, billingPeriod, auditsGenerated } = user;
  const fallbackName = name || (email ? email.split('@')[0] : 'User');
  // ensure details section now also uses fallback name
  const displayName = fallbackName;

  // Plan audit limits
  const planLimits = {
    'Free': 1,
    'Starter': 10,
    'Growth': 50,
    'Pro': Infinity,
  };

  const currentPlan = plan || 'Free';
  const currentPeriod = billingPeriod || 'Monthly';
  const maxAudits = planLimits[currentPlan];
  const usedAudits = auditsUsed || 0;
  const auditPercentage = maxAudits === Infinity ? 0 : Math.min((usedAudits / maxAudits) * 100, 100);
  const hasReachedLimit = maxAudits !== Infinity && usedAudits >= maxAudits;
  const periodLabel = currentPeriod === 'Yearly' ? 'yearly' : 'monthly';

  const profileStatus = premium
    ? { label: `${currentPlan} plan - ${currentPeriod} (${usedAudits}/${maxAudits === Infinity ? '∞' : maxAudits} audits used)`, color: 'text-emerald-600' }
    : auditsGenerated >= 1
    ? { label: 'Free plan expired. Please upgrade to premium.', color: 'text-red-600' }
    : { label: 'Free user (1 free audit available)', color: 'text-orange-600' };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
          <button
            onClick={() => navigate('/')}
            className="text-sm px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Back Home
          </button>
        </div>

        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div className="relative">
            <img
              src={generateAvatar(fallbackName)}
              alt="avatar"
              className="w-24 h-24 rounded-full border-2 border-indigo-500"
            />
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-800">{fallbackName}</p>
            <p className="text-sm text-gray-500">{email || 'No email set'}</p>
            <p className={`text-xs font-semibold mt-1 ${profileStatus.color}`}>
              {profileStatus.label}
            </p>
          </div>
        </div>

        {/* 📊 SUBSCRIPTION & AUDITS CARD */}
        <div className="w-full bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Subscription & Audits</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentPlan === 'Free' ? 'bg-gray-200 text-gray-800' :
              currentPlan === 'Starter' ? 'bg-blue-200 text-blue-800' :
              currentPlan === 'Growth' ? 'bg-purple-200 text-purple-800' :
              'bg-yellow-200 text-yellow-800'
            }`}>
              {currentPlan} {currentPeriod === 'Yearly' && '(Yearly)'} {currentPeriod === 'Monthly' && '(Monthly)'}
            </span>
          </div>

          {/* AUDIT USAGE */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">{currentPeriod} Audits</p>
              <p className="text-sm font-bold text-gray-800">{usedAudits}/{maxAudits === Infinity ? '∞' : maxAudits}</p>
            </div>
            {maxAudits !== Infinity && (
              <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    hasReachedLimit ? 'bg-red-500' :
                    auditPercentage > 75 ? 'bg-orange-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${auditPercentage}%` }}
                />
              </div>
            )}
            {maxAudits === Infinity && (
              <div className="h-3 rounded-full bg-yellow-200 overflow-hidden flex items-center justify-center text-xs font-bold text-yellow-800">
                UNLIMITED
              </div>
            )}
          </div>

          {/* STATUS & UPGRADE */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              {hasReachedLimit && (
                <p className="text-xs text-red-600 font-semibold">⚠️ {currentPeriod} limit reached</p>
              )}
              {auditPercentage > 75 && !hasReachedLimit && (
                <p className="text-xs text-orange-600 font-semibold">⏰ Running low on audits</p>
              )}
              {!hasReachedLimit && auditPercentage <= 75 && currentPlan !== 'Pro' && (
                <p className="text-xs text-gray-600">Audits reset on 1st of next {periodLabel}</p>
              )}
              {currentPlan === 'Pro' && (
                <p className="text-xs text-emerald-600 font-semibold">✓ Unlimited audits - No limits!</p>
              )}
            </div>
            {currentPlan === 'Free' && (
              <button
                onClick={() => navigate('/pricing')}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* DETAILS CARD */}
        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-6">            
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                <p className="text-sm text-gray-800">{displayName || '-'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                <p className="text-sm text-gray-800">{email || '-'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Plan</p>
                <p className="text-sm text-gray-800 font-semibold text-emerald-600">{currentPlan}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Role</p>
                <p className="text-sm text-gray-800">{role || 'User'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Phone</p>
                <p className="text-sm text-gray-800">{phone || 'N/A'}</p>
              </div>
            </div>
          </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('accessToken');
              navigate('/login');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
