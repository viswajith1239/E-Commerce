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

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
          payment_method_data: {
            billing_details: {
              name: shippingAddress.fullName,
              address: {
                line1: shippingAddress.addressLine1,
                line2: shippingAddress.addressLine2,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postal_code: shippingAddress.postalCode,
                country: shippingAddress.country,
              },
            },
          },
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        console.error('Payment error:', paymentError);
        setError(paymentError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment successful:', paymentIntent);

        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
          console.error('Cart items invalid:', items);
          setError('Cart is empty. Please add items to proceed.');
          setProcessing(false);
          return;
        }

        const orderData = {
          products: items.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: {
            fullName: shippingAddress.fullName,
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2 || '',
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
          totalAmount,
          paymentIntentId: paymentIntent.id,
        };

        console.log('Order data being sent:', JSON.stringify(orderData, null, 2));

        try {
          const result = await dispatch(createOrder(orderData)).unwrap();
          console.log('Order creation result:', result);

          dispatch(clearCart());
          dispatch(resetCheckout());
          navigate('/order-confirmation');
        } catch (error) {
          console.error('Order creation error:', error);
          setError(error.message || 'Failed to create order');
          setProcessing(false);
        }
      } else {
        console.log('Payment not succeeded:', paymentIntent?.status);
        setError('Payment was not successful. Please try again.');
        setProcessing(false);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
      <Button type="submit" className="w-full mt-6" disabled={!stripe}>
        Pay ${totalAmount.toFixed(2)}
      </Button>
    </form>
  );
};