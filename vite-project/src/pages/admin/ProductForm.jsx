import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProduct,
  updateProduct,
  getProduct,
  clearSuccess
} from '../../features/products/productSlice';
import Layout from '../../components/layout/Layout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loading from '../../components/ui/Loading';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, isLoading, error, success } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: 'in_stock', // renamed from status to stock
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(getProduct(id));
    }
    return () => {
      dispatch(clearSuccess());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (id && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock || 'in_stock', // use product.stock here
        image: null
      });
      setImagePreview(`http://localhost:5000${product.imageUrl}`);
    }
  }, [id, product]);

  useEffect(() => {
    if (success) {
      navigate('/admin/products');
    }
  }, [success, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    if (!formData.description) {
      errors.description = 'Description is required';
    }
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    if (!id && !formData.image) {
      errors.image = 'Image is required';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('stock', formData.stock);  // Append 'stock' now
    if (formData.image) {
      productData.append('image', formData.image);
    }

    if (id) {
      dispatch(updateProduct({ id, productData }));
    } else {
      dispatch(createProduct(productData));
    }
  };

  if (id && isLoading) {
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? 'Edit Product' : 'Add New Product'}
          </h1>
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={formErrors.name}
                required
              />

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`textarea ${formErrors.description ? 'border-red-500' : ''}`}
                  rows="4"
                  required
                />
                {formErrors.description && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <Input
                label="Price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                error={formErrors.price}
                step="0.01"
                min="0"
                required
              />

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Stock Status
                </label>
                <select
                  name="stock"   
                  value={formData.stock}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Product Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="hidden"
                  id="image-upload"
                  accept="image/*"
                />
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative w-40 h-40">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                      />
                      <label
                        htmlFor="image-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded"
                      >
                        Change Image
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-gray-400"
                    >
                      Upload Image
                    </label>
                  )}
                </div>
                {formErrors.image && (
                  <p className="text-red-500 text-xs italic mt-1">
                    {formErrors.image}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={isLoading}
                >
                  {id ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default ProductForm;
