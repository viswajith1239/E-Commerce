# MERN E-Commerce Platform

A full-featured e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- 🛍️ Product browsing and shopping cart
- 💳 Secure checkout with Stripe
- 👤 User authentication and authorization
- 📦 Product management for admins
- 📱 Responsive design for all devices
- 🔒 Protected routes and API endpoints
- 📸 Image upload for products
- 📊 Order tracking and history

## Tech Stack

### Frontend
- React.js (Functional components + Hooks)
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Stripe Elements for payment

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- multer for file uploads
- Stripe API for payments

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Stripe account (for test keys)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd e-commerce
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

Backend (.env):
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Frontend (.env):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

## Project Structure

```
e-commerce/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── server.js       # Entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/ # Reusable components
│       ├── features/   # Redux slices
│       ├── pages/      # Page components
│       ├── store/      # Redux store
│       └── App.jsx     # Root component
```

## API Endpoints

### Auth
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- GET /api/auth/me - Get current user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (Admin)
- PUT /api/products/:id - Update product (Admin)
- DELETE /api/products/:id - Delete product (Admin)

### Orders
- POST /api/orders - Create order
- GET /api/orders - Get all orders (Admin)
- GET /api/orders/my-orders - Get user's orders
- GET /api/orders/:id - Get single order

### Checkout
- POST /api/checkout/create-payment-intent - Create Stripe payment intent

## Available Scripts

Backend:
- `npm run dev` - Start development server
- `npm start` - Start production server

Frontend:
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## Testing

Use Postman or similar tools to test the API endpoints. A Postman collection is included in the `/docs` folder.

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- Secure cookie usage
- Input validation
- File upload validation
- XSS protection
- CORS configuration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 