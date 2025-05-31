import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { createPaymentIntent, resetCheckout } from '../features/checkout/checkoutSlice';
import { clearCart } from '../features/cart/cartSlice';
import { createOrder } from '../features/orders/orderSlice';
import Layout from '../components/layout/Layout';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loading from '../components/ui/Loading';

// Load Stripe outside of components to avoid recreating it
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ shippingAddress, setProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { items, totalAmount } = useSelector((state) => state.cart);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
      return;
    }

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required'
      });

      if (paymentError) {
        setError(paymentError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Create order
        await dispatch(createOrder({
          products: items.map(item => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress,
          totalAmount,
          paymentIntentId: paymentIntent.id
        }));

        // Clear cart and checkout state
        dispatch(clearCart());
        dispatch(resetCheckout());

        // Navigate to success page
        navigate('/order-confirmation');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && (
        <div className="text-red-500 text-sm mt-4">
          {error}
        </div>
      )}
      <Button
        type="submit"
        className="w-full mt-6"
        disabled={!stripe}
      >
        Pay ${totalAmount.toFixed(2)}
      </Button>
    </form>
  );
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { clientSecret, isLoading, error } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Create payment intent when component mounts
    dispatch(createPaymentIntent({ amount: totalAmount }));

    // Cleanup
    return () => {
      dispatch(resetCheckout());
    };
  }, [dispatch, isAuthenticated, items.length, navigate, totalAmount]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading || !clientSecret) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Shipping Address */}
          <Card>
            <CardBody>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  label="Address Line 1"
                  name="addressLine1"
                  value={shippingAddress.addressLine1}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  label="Address Line 2 (Optional)"
                  name="addressLine2"
                  value={shippingAddress.addressLine2}
                  onChange={handleAddressChange}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                  <Input
                    label="State"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postal Code"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    required
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Payment */}
          <Card>
            <CardBody>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Payment Details
              </h2>
              {error && (
                <div className="text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                  },
                }}
              >
                <CheckoutForm
                  shippingAddress={shippingAddress}
                  setProcessing={setProcessing}
                />
              </Elements>
            </CardBody>
          </Card>
        </div>

        {/* Order Summary */}
        <Card className="mt-8">
          <CardBody>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <img
                      src={`http://localhost:5000${item.imageUrl}`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-gray-600">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <Loading size="lg" />
            <div className="text-center mt-4">
              Processing your payment...
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Checkout; 