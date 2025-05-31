import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Layout = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-blue-600">
              E-Commerce
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Products
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/cart" 
                    className="text-gray-700 hover:text-blue-600 relative"
                  >
                    Cart
                    {items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {items.length}
                      </span>
                    )}
                  </Link>
                  <Link 
                    to="/orders" 
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/products" 
                      className="text-gray-700 hover:text-blue-600"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-lg mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} E-Commerce. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 