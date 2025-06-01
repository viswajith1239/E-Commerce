import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE,
  frontendURL: process.env.FRONTEND_URL,
  uploadPath: process.env.UPLOAD_PATH,
  maxFileSize: process.env.MAX_FILE_SIZE,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};

export default config;
