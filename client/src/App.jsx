import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Footer from "./component/shared/Footer";
import Navbar from "./component/shared/Navbar";
import TopBar from "./component/shared/TopBar";
import AOS from 'aos';
import 'aos/dist/aos.css';
import FeeNotice from "./component/HomeComponents/FeeNotice";
import ScrollToTop from "./component/shared/ScrollToTop";

function App() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  AOS.init();
  
  // Show scroll button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // WhatsApp click handler
  const handleWhatsAppClick = () => {
    const phoneNumber = "8801337874935"; // Correct format: no '+', no '0' at start
    const message = "Hello! I'm interested in your services.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div>
      {/* Scroll to top on route change */}
      <ScrollToTop />
      
      <header className="sticky top-0 w-full z-50 bg-white shadow-md">
        <TopBar />
        <Navbar />
        <FeeNotice />
      </header>
      <Outlet />
      <Footer />
      
      {/* WhatsApp Floating Button with Animations */}
      <div 
        className="fixed bottom-20 right-6 z-20 cursor-pointer group"
        onClick={handleWhatsAppClick}
      >
        {/* Pulsing rings */}
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-50 animate-pulse"></div>
        
        {/* Main button */}
        <div className="relative bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition-all duration-300 rounded-full p-2 shadow-2xl transform group-hover:scale-110 group-active:scale-95">
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="white"
            className="relative z-10 drop-shadow-sm"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </div>
        
        {/* Tooltip */}
       
      </div>

      {/* Scroll to Top Button with Animation */}
      {showScrollButton && (
        <div 
          className="fixed bottom-6 right-6 z-20 cursor-pointer group"
          onClick={scrollToTop}
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 rounded-full p-3 shadow-2xl transform group-hover:scale-110 group-active:scale-95 group-hover:rotate-12">
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="white"
              className="relative z-10 drop-shadow-sm transform group-hover:-translate-y-1 transition-transform duration-300"
            >
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
          </div>
          
          {/* Tooltip */}
          
        </div>
      )}
    </div>
  );
}

export default App;