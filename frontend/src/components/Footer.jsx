import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { phone, email, address, brand_name } = useSettings();

  return (
    <footer id="contact" className="bg-primary-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-3xl font-serif font-bold tracking-widest uppercase">{brand_name || "DARAIN"}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Exquisite Abaya and Pardha collection for the modern woman who values elegance, modesty, and quality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-400 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-gray-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-gray-400 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/collections" className="hover:text-white transition-colors">Collections</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-bold mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info — dynamic */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {phone && (
                <li className="flex items-center space-x-3">
                  <Phone size={16} />
                  <a href={`tel:${phone.replace(/\s/g,'')}`} className="hover:text-white transition-colors">{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex items-center space-x-3">
                  <Mail size={16} />
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
                </li>
              )}
              {address && (
                <li className="flex items-start space-x-3">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {brand_name || "DARAIN FASHION"}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 cursor-pointer">
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
