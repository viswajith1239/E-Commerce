import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';

const OrderConfirmation = () => {
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