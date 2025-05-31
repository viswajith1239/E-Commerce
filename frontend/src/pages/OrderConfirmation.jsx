import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useStripe } from '@stripe/react-stripe-js';
import { clearCart } from '../features/cart/cartSlice';
import { resetCheckout } from '../features/checkout/checkoutSlice';
import Layout from '../components/layout/Layout';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';

const OrderConfirmation = () => {
  const stripe = useStripe();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = React.useState('processing');

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      navigate('/');
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setStatus('success');
          // Clear cart and checkout state
          dispatch(clearCart());
          dispatch(resetCheckout());
          break;
        case 'processing':
          setStatus('processing');
          break;
        case 'requires_payment_method':
          setStatus('failed');
          navigate('/checkout');
          break;
        default:
          setStatus('failed');
          navigate('/checkout');
          break;
      }
    });
  }, [stripe, dispatch, navigate]);

  if (status === 'processing') {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading size="lg" />
          <div className="ml-4">Processing your payment...</div>
        </div>
      </Layout>
    );
  }

  if (status === 'failed') {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardBody>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Payment Failed
                </h2>
                <p className="text-gray-600 mb-6">
                  There was an issue processing your payment. Please try again.
                </p>
                <Link to="/checkout">
                  <Button>
                    Return to Checkout
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Order Confirmed!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. We'll send you an email with your order details
                and tracking information once your order ships.
              </p>
              <div className="space-x-4">
                <Link to="/orders">
                  <Button>
                    View Orders
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="ghost">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderConfirmation; 