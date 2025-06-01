import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice';
import Layout from '../components/layout/Layout';
import Card, { CardBody } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast,{Toaster} from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("successfully loggged in!")
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
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

    await dispatch(login(formData));
  };

  return (
  <Layout>
      <div className="max-w-md mx-auto">
        <Toaster/>
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold text-center mb-6  text-black">Login</h2>
            <form onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
                placeholder="Enter your email"
                className='bg-white text-black'
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                placeholder="Enter your password"
                 className='bg-white text-black'
              />
              {error && (
                <div className="text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-900 text-white"
                isLoading={isLoading}
              >
                Login
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
    
  );
};

export default Login;