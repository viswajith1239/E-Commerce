import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getProduct } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import Layout from '../components/layout/Layout';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, isLoading, error } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login first to add items to cart', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/login');
      return;
    }
    dispatch(addToCart({ product, quantity }));
    toast.success('Item added to cart!', {
      position: 'top-right',
      autoClose: 2000,
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

  if (!product) {
    return (
      <Layout>
        <div className="text-center text-gray-600">
          Product not found
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <Card className="md:flex">
          <div className="md:w-1/2">
            <img
              src={`http://localhost:5000${product.imageUrl}`}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <CardBody className="md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-6">
              {product.description}
            </p>
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className={`text-sm ${
                product.status === 'in_stock' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {product.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="input w-24"
                disabled={product.status === 'out_of_stock'}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.status === 'out_of_stock'}
            >
              Add to Cart
            </Button>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default ProductDetail; 