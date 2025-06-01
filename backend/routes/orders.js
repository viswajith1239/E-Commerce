import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create order
router.post('/', protect, async (req, res) => {
  try {
    console.log('Received order request body:', JSON.stringify(req.body, null, 2));
    
    const { products, shippingAddress, totalAmount, paymentIntentId } = req.body;
    console.log('Products array:', products);
    
    // Validate required fields
    if (!products) {
      console.log('Products array is missing');
      return res.status(400).json({
        success: false,
        message: 'Products array is required'
      });
    }

    if (!Array.isArray(products)) {
      console.log('Products is not an array:', typeof products);
      return res.status(400).json({
        success: false,
        message: 'Products must be an array'
      });
    }

    if (products.length === 0) {
      console.log('Products array is empty');
      return res.status(400).json({
        success: false,
        message: 'Products array cannot be empty'
      });
    }

    // Validate products structure
    const isValidProducts = products.every(item => 
      item && 
      typeof item === 'object' && 
      item.productId && 
      typeof item.quantity === 'number' && 
      item.quantity > 0
    );

    if (!isValidProducts) {
      console.log('Invalid products structure:', products);
      return res.status(400).json({
        success: false,
        message: 'Invalid products structure. Each product must have productId and quantity'
      });
    }

    // Validate products and calculate total
    let calculatedTotal = 0;
    const orderProducts = [];

    for (const item of products) {
      console.log('Processing product:', item);
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }

      // Check if product is in stock
      if (product.stock === 'out_of_stock') {
        return res.status(400).json({
          success: false,
          message: `Product is out of stock: ${product.name}`
        });
      }

      calculatedTotal += product.price * item.quantity;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      // Update product stock status
      product.stock = 'out_of_stock';
      await product.save();
    }

    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      console.log('Total amount mismatch:', { calculated: calculatedTotal, received: totalAmount });
      return res.status(400).json({
        success: false,
        message: 'Total amount mismatch'
      });
    }

    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      totalAmount: calculatedTotal,
      paymentStatus: 'completed',
      stripePaymentId: paymentIntentId,
      shippingAddress
    });

    await order.populate('products.product');

    console.log('Order created successfully:', order._id);

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;

      // Update order status
      const order = await Order.findOne({
        stripePaymentId: paymentIntent.id
      });

      if (order) {
        order.paymentStatus = 'completed';
        await order.save();

        // Update product stock
        for (const item of order.products) {
          const product = await Product.findById(item.product);
          product.stock = 'out_of_stock';
          await product.save();
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Webhook error',
      error: error.message
    });
  }
});

// Get user's orders
router.get('/my-orders', protect, async (req, res) => {
  console.log("entered in to my orders");
  
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product')
      .sort('-createdAt');
    console.log("orders",orders);

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if the order belongs to the user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

export default router; 