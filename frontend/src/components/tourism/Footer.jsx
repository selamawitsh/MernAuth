// src/components/tourism/Footer.jsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plane, Phone, Mail, MapPin } from 'lucide-react';
// Import social icons individually - these are the correct export names
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-8 h-8 text-green-400" />
              <span className="text-xl font-bold">Ethiopia Escape</span>
            </div>
            <p className="text-gray-400 mb-4">
              Discover the wonders of Ethiopia with our expert-guided tours and authentic experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#destinations" className="hover:text-green-400 transition-colors">Destinations</a></li>
              <li><a href="#packages" className="hover:text-green-400 transition-colors">Packages</a></li>
              <li><a href="#testimonials" className="hover:text-green-400 transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Contact</a></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-400" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-400" />
                <span>+251 911 234 567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-400" />
                <span>info@ethiopiaescape.com</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Monday - Friday: 9:00 - 18:00</li>
              <li>Saturday: 10:00 - 16:00</li>
              <li>Sunday: Closed</li>
              <li className="mt-4 text-green-400">24/7 Emergency Support</li>
            </ul>
          </motion.div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Ethiopia Escape. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;