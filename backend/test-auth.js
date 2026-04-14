import config from './src/config/config.js';
import jwt from 'jsonwebtoken';

// Test token generation
const testUser = {
  _id: '123456',
  email: 'test@example.com'
};

const accessToken = jwt.sign(
  { id: testUser._id, email: testUser.email },
  config.jwtSecret,
  { expiresIn: '15m' }
);

console.log('Generated Token:', accessToken);
console.log('');

// Test token verification
try {
  const decoded = jwt.verify(accessToken, config.jwtSecret);
  console.log('Token verified successfully:', decoded);
} catch (error) {
  console.log('Token verification failed:', error.message);
}
