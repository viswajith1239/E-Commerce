import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrder } from '../features/orders/orderSlice';
import Layout from '../components/layout/Layout';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, isLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrder(id));
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loading size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-500">
          {error}
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="text-center text-gray-600">
          Order not found
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Order Details
          </h1>
          <Link to="/orders">
            <Button variant="ghost">
              Back to Orders
            </Button>
          </Link>
        </div>

        <div className="grid gap-8">
          {/* Order Summary */}
          <Card>
            <CardBody>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Order Information</h2>
                  <div className="space-y-2 text-gray-600">
                    <p>Order ID: {order._id}</p>
                    <p>Date: {formatDate(order.createdAt)}</p>
                    <p>Status: <span className="capitalize">{order.status}</span></p>
                    <p>Total: ${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
                  <div className="space-y-2 text-gray-600">
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && (
                      <p>{order.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Order Items */}
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center py-4 border-b last:border-b-0"
                  >
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={`http://localhost:5000${item.product.imageUrl}`}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-gray-600">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail; 