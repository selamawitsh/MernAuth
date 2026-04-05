import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/tourism/Navbar';
import HeroSection from '../components/tourism/HeroSection';
import SearchBar from '../components/tourism/SearchBar';
import DestinationsSection from '../components/tourism/DestinationsSection';
import WhyChooseUs from '../components/tourism/WhyChooseUs';
import PackagesSection from '../components/tourism/PackagesSection';
import TestimonialsSection from '../components/tourism/TestimonialsSection';
import StatsSection from '../components/tourism/StatsSection';
import NewsletterSection from '../components/tourism/NewsletterSection';
import ContactSection from '../components/tourism/ContactSection';
import Footer from '../components/tourism/Footer';

const TourismLanding = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white overflow-x-hidden">
      <Navbar user={user} />
      <HeroSection opacity={heroOpacity} scale={heroScale} />
      <SearchBar />
      <DestinationsSection />
      <WhyChooseUs />
      <PackagesSection />
      <TestimonialsSection />
      <StatsSection />
      <NewsletterSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default TourismLanding;