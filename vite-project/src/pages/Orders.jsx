import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '../features/orders/orderSlice';
import Layout from '../components/layout/Layout';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, isLoading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(getMyOrders());
  }, [dispatch, isAuthenticated, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  if (!orders || orders.length === 0) {
    return (
      <Layout>
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet.
              </p>
              <Link to="/">
                <Button>
                  Start Shopping
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardBody>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="text-sm text-gray-600 mb-1">
                      Order placed on {formatDate(order.createdAt)}
                    </div>
                    <div className="font-semibold">
                      Order #{order._id}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <div className="text-right mb-4 md:mb-0">
                      <div className="text-sm text-gray-600">
                        Total Amount
                      </div>
                      <div className="font-semibold">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                    <Link to={`/orders/${order._id}`}>
                      <Button>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="mt-6 border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item._id} className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={`http://localhost:5000${item.product.imageUrl}`}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-semibold text-sm">
                            {item.product.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center text-gray-600">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Orders; 