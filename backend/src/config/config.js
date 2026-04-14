import dotenv from 'dotenv';
dotenv.config();



if(!process.env.PORT){
  throw new Error("PORT is not defined in environment variables");
}
if(!process.env.MONGODB_URL){
  throw new Error("MONGODB_URL is not defined in environment variables");
}
if(!process.env.jwtSecret){
  throw new Error("jwtSecret is not defined in environment variables");
}
if(!process.env.refreshSecret){
  throw new Error("refreshSecret is not defined in environment variables");
}
if(!process.env.RAZORPAY_KEY_ID){
  console.warn("RAZORPAY_KEY_ID is not defined in environment variables");
}
if(!process.env.RAZORPAY_KEY_SECRET){
  console.warn("RAZORPAY_KEY_SECRET is not defined in environment variables");
}

const config = {
  port: process.env.PORT || 3000,
  MONGODB_URL: process.env.MONGODB_URL,
  jwtSecret: process.env.jwtSecret,
  refreshSecret: process.env.refreshSecret,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
};

export default config;
