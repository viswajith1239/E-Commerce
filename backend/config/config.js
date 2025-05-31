import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars from parent directory (backend folder)
dotenv.config({ path: join(__dirname, '..', '.env') });

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce',
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_key_123',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  uploadPath: process.env.UPLOAD_PATH || 'uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5000000'),
  frontendURL: process.env.FRONTEND_URL || 'http://localhost:5174'
};

export default config; 