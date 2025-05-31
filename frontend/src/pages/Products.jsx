import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../features/products/productSlice';
import { addToCart } from '../features/cart/cartSlice';
import Layout from '../components/layout/Layout';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';

const Products = () => {
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
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

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product._id}>
            <img
              src={`http://localhost:5000${product.imageUrl}`}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <CardBody>
              <Link 
                to={`/products/${product._id}`}
                className="block mb-2"
              >
                <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
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
              <Button
                className="w-full mt-4"
                onClick={() => handleAddToCart(product)}
                disabled={product.status === 'out_of_stock'}
              >
                Add to Cart
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Products; 