import { useContext, useEffect, useRef, useState } from 'react';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import img1 from "../../assets/emouja.jpg";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../provider/AuthProvider';
import TopBar from './TopBar';

export default function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close dropdown and mobile menu when route changes
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Helper: check active link
  const isActive = (path) => location.pathname === path;

  const handleMobileMenuItemClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full relative">
      {/* Mobile Logo and Menu Button Bar */}
      <div className="flex sm:hidden items-center justify-between px-4 py-2 bg-white shadow-sm relative z-10">
        <Link to="/" onClick={handleMobileMenuItemClick}>
          <img src='logo.png' alt="Logo" className="h-12 w-12 shadow-md" />
        </Link>
        <div className="flex gap-2">
          <button
            onClick={toggleMobileMenu}
            className="text-green-900 hover:text-green-700 p-1"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="bg-white shadow-xs hidden md:block relative z-30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <Link to="/">
              <img src='logo.png' alt="Logo" className="h-12 w-12 shadow-md" />
            </Link>

            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className={`text-lg lg:text-xl font-inter1 font-medium transition-colors duration-200 hover:text-green-700 ${
                  isActive("/") ? "text-green-700 font-semibold" : "text-gray-900"
                }`}
              >
                হোম
              </Link>
              <Link
                to="/packages"
                className={`text-lg lg:text-xl font-inter1 font-medium transition-colors duration-200 hover:text-green-700 ${
                  isActive("/packages") ? "text-green-700 font-semibold" : "text-gray-900"
                }`}
              >
                প্যাকেজ
              </Link>
              <Link
                to="/tutorial"
                className={`text-lg lg:text-xl font-inter1 font-medium transition-colors duration-200 hover:text-green-700 ${
                  isActive("/tutorial") ? "text-green-700 font-semibold" : "text-gray-900"
                }`}
              >
                টিউটোরিয়াল
              </Link>

              {user && (
                <>
                <Link
                to="/map/list"
                className={`text-lg lg:text-xl font-inter1 font-medium transition-colors duration-200 hover:text-green-700 ${
                  isActive("/map/list") ? "text-green-700 font-semibold" : "text-gray-900"
                }`}
              >
                আমার ক্রয়কৃত ম্যাপ
              </Link>
                </>
              )}
            </div>

            <div className="flex items-center relative">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center text-gray-700 hover:text-green-700 focus:outline-none"
                  >
                    <User className="w-6 h-6" />
                  </button>

                 {dropdownOpen && (
  <div className="absolute -right-5 mt-6 w-60 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
    <div>
      <Link
      to="/profile"
      className={`flex items-center gap-2 px-4 font-in py-3 text-lg font-inter1 rounded-t-md ${
        isActive("/profile") ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-green-50"
      }`}
    >
      <User className="w-5 h-5" />
      প্রোফাইল
    </Link>
    </div>
    <Link
      to="/packages/dashboard"
      className={`flex items-center gap-2 px-4 font-in py-3 text-lg font-inter1 ${
        isActive("/packages/dashboard") ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-green-50"
      }`}
    >
      <User className="w-5 h-5" />
      আমার প্যাকেজ
    </Link>
     <Link
      to="/map/list"
      className={`flex items-center gap-2 px-4 font-in py-3 text-lg font-inter1 ${
        isActive("/map/list") ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-green-50"
      }`}
    >
      <User className="w-5 h-5" />
      
        আমার ক্রয়কৃত ম্যাপ
    </Link>
    <button
      onClick={() => {
        logOut();
        setDropdownOpen(false);
      }}
      className="w-full flex items-center gap-2  px-4 py-3 text-xl font-inter1 text-red-600 hover:bg-red-50 rounded-b-md"
    >
      <LogOut className="w-5 h-5" />
      লগআউট
    </button>
  </div>
)}

                </div>
              ) : (
                <Link to="/login">
                  <button className="flex items-center bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors shadow-md">
                    <span>লগইন</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0  bg-opacity-50 z-20 md:hidden  backdrop-blur-sm" />
      )}

      {/* Mobile Navigation */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden fixed top-0 left-0 w-full bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <TopBar/>
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <Link to="/" onClick={handleMobileMenuItemClick}>
            <img src={img1} alt="Logo" className="h-12 w-12 shadow-md" />
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="text-green-900 hover:text-green-700 p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div className="p-4">
          <div className="flex flex-col gap-3">
            <Link 
              to="/" 
              onClick={handleMobileMenuItemClick}
              className={`p-3 rounded-lg font-medium transition-colors ${
                isActive("/") ? "text-green-700 bg-green-50" : "text-gray-900 hover:bg-green-50"
              }`}
            >
              হোম
            </Link>
            <Link 
              to="/packages" 
              onClick={handleMobileMenuItemClick}
              className={`p-3 rounded-lg font-medium transition-colors ${
                isActive("/packages") ? "text-green-700 bg-green-50" : "text-gray-900 hover:bg-green-50"
              }`}
            >
              প্যাকেজ
            </Link>
            <Link 
              to="/tutorial" 
              onClick={handleMobileMenuItemClick}
              className={`p-3 rounded-lg font-medium transition-colors ${
                isActive("/tutorial") ? "text-green-700 bg-green-50" : "text-gray-900 hover:bg-green-50"
              }`}
            >
              টিউটোরিয়াল
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/profile" 
                  onClick={handleMobileMenuItemClick}
                  className={`p-3 rounded-lg font-medium transition-colors ${
                    isActive("/profile") ? "text-green-700 bg-green-50" : "text-gray-900 hover:bg-green-50"
                  }`}
                >
                  প্রোফাইল
                </Link>
                <Link 
                  to="/packages/dashboard" 
                  onClick={handleMobileMenuItemClick}
                  className={`p-3 rounded-lg font-medium transition-colors ${
                    isActive("/packages/dashboard") ? "text-green-700 bg-green-50" : "text-gray-900 hover:bg-green-50"
                  }`}
                >
                  আমার প্যাকেজ
                </Link>
                <Link 
                  to="/map/list" 
                  onClick={handleMobileMenuItemClick}
                  className={`p-3 rounded-lg font-medium transition-colors ${
                    isActive("/map/list") ? "text-green-700 bg-green-50" : "text-gray-900 hover:bg-green-50"
                  }`}
                >
                  আমার ক্রয়কৃত ম্যাপ
                </Link>
              </>
            )}
            
            {user ? (
              <button 
                onClick={() => {
                  logOut();
                  handleMobileMenuItemClick();
                }}
                className="bg-red-600 text-white  px-4 py-3 rounded-lg hover:bg-red-700 transition-colors mt-4 shadow-md text-center"
              >
                লগআউট
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  handleMobileMenuItemClick();
                }}
                className="bg-green-700 flex justify-center text-white px-4 py-3 rounded-lg hover:bg-green-800 transition-colors mt-4 shadow-md text-left"
              >
                লগইন
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}