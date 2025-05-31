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
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-white hover:text-blue-200">
              E-Commerce
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-white hover:text-blue-200">
                Products
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/cart" 
                    className="text-white hover:text-blue-200 relative"
                  >
                    Cart
                    {items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-blue-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {items.length}
                      </span>
                    )}
                  </Link>
                  <Link 
                    to="/orders" 
                    className="text-white hover:text-blue-200"
                  >
                    Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/products" 
                      className="text-white hover:text-blue-200"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-blue-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-200"
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white shadow-lg mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">
            © {new Date().getFullYear()} E-Commerce. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 