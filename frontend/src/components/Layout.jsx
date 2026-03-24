import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import TopBar from './TopBar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

const Layout = ({ children }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${scrolled ? 'max-h-0' : 'max-h-20'}`}>
        <TopBar />
      </div>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
