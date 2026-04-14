import crypto from 'crypto';
import config from '../config/config.js';

const RAZORPAY_KEY_ID = config.razorpayKeyId;
const RAZORPAY_KEY_SECRET = config.razorpayKeySecret;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn('Razorpay keys are not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env');
}

async function createRazorpayOrder(req, res) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { amount } = req.body; // in INR
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const orderBody = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `ord_${Date.now().toString().slice(-8)}_${userId.toString().slice(-6)}`,
      payment_capture: 1,
    };

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(orderBody),
    });

    const order = await response.json();

    if (!response.ok) {
      console.error('Razorpay order creation failed', order);
      return res.status(500).json({ success: false, message: order.error?.description || 'Razorpay order creation failed', order });
    }

    return res.status(201).json({ success: true, order, key: RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('createRazorpayOrder error', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function verifyRazorpayPayment(req, res) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment data' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment signature mismatch' });
    }

    // Map amount to plan with billing period detection
    const planMap = {
      // Monthly billing
      '1': { plan: 'Starter', period: 'Monthly' },
      '59': { plan: 'Growth', period: 'Monthly' },
      '119': { plan: 'Pro', period: 'Monthly' },
      // Yearly billing
      '10': { plan: 'Starter', period: 'Yearly' },
      '590': { plan: 'Growth', period: 'Yearly' },
      '1190': { plan: 'Pro', period: 'Yearly' },
    };

    const planInfo = planMap[String(amount)] || { plan: 'Free', period: 'Monthly' };

    const User = (await import('../Models/userAuth.Model.js')).default;
    await User.findByIdAndUpdate(userId, { 
      premium: true,
      plan: planInfo.plan,
      billingPeriod: planInfo.period,
      auditsUsed: 0,
      lastAuditResetDate: new Date(),
    });

    return res.status(200).json({ success: true, message: `${planInfo.plan} plan (${planInfo.period}) activated. Thank you for your purchase.` });
  } catch (err) {
    console.error('verifyRazorpayPayment error', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export { createRazorpayOrder, verifyRazorpayPayment };