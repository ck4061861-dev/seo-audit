import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: 2,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    plan: {
      type: String,
      enum: ['Free', 'Starter', 'Growth', 'Pro'],
      default: 'Free',
    },
    billingPeriod: {
      type: String,
      enum: ['Monthly', 'Yearly'],
      default: 'Monthly',
    },
    premium: {
      type: Boolean,
      default: false,
    },
    auditsUsed: {
      type: Number,
      default: 0,
    },
    lastAuditResetDate: {
      type: Date,
      default: Date.now,
    },
    auditsGenerated: {
      type: Number,
      default: 0,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const authSchema = mongoose.model('User', userSchema);

export default authSchema;