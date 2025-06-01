import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice';
import Layout from '../components/layout/Layout';
import Card, { CardBody } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

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
      navigate('/');
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

  const handleChange = (event) => {
    console.log('Input changed:', event.target.name, event.target.value);
    const { name, value } = event.target;
    
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: value
      };
      console.log('New form state:', newState);
      return newState;
    });

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    await dispatch(login(formData));
  };

  console.log('Current form data:', formData);

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Card>
          <CardBody>
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                error={formErrors.email}
                placeholder="Enter your email"
                required
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password || ''}
                onChange={handleChange}
                error={formErrors.password}
                placeholder="Enter your password"
                required
              />
              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
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
