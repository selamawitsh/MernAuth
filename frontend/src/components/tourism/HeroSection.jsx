import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const HeroSection = ({ opacity, scale }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://i.pinimg.com/736x/68/64/a9/6864a998dbb81eef22f7843c03c921ca.jpg',
      title: 'Discover Harari',
      subtitle: 'The Eighth Wonder of the World',
      description: 'Explore ancient Harari city walls and vibrant culture',
      color: 'from-amber-600 to-orange-600'
    },
    {
      image: 'https://i.pinimg.com/1200x/17/02/ba/1702bac3ad1d391cbf78d6b9ec833dbf.jpg',
      title: 'Discover Harari',
      subtitle: 'The Eighth Wonder of the World',
      description: 'Explore ancient Harari city walls and vibrant culture',
      color: 'from-amber-600 to-orange-600'
    },
    {
      image: 'https://images.squarespace-cdn.com/content/v1/57b88db03e00be38aec142b0/1507537338602-M578K9J0HS75JTMB16GT/Blog+Cover+-+In+the+Mountains+of+Tigray+-+Rock-hewn+Churches+of+Ethiopia.jpg?format=1500w',
      title: 'Discover Lalibela',
      subtitle: 'The Eighth Wonder of the World',
      description: 'Explore ancient rock-hewn churches and experience Ethiopian Orthodox Christianity',
      color: 'from-amber-600 to-orange-600'
    },
    {
      image: 'https://plus.unsplash.com/premium_photo-1666872507875-d02ee42e8564?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Explore Simien Mountains',
      subtitle: 'Africa\'s Roof',
      description: 'Trek through breathtaking landscapes and spot rare wildlife',
      color: 'from-green-600 to-teal-600'
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR8SAyiAJ_sDRMr8UK1r4F8Zi79Kmn1vMIDw&s',
      title: 'Visit Axum',
      subtitle: 'Ancient Kingdom',
      description: 'Discover the legendary Queen of Sheba and ancient obelisks',
      color: 'from-purple-600 to-pink-600'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentSlide === index ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-20 z-10`} />
        </motion.div>
      ))}
      
      <motion.div 
        style={{ opacity, scale }}
        className="relative z-20 h-full flex items-center justify-center"
      >
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-none mb-6">
              Welcome to Ethiopia
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover the Hidden
              <span className="block bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                Wonders of Ethiopia
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Experience ancient history, breathtaking landscapes, and warm hospitality in the cradle of civilization
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-yellow-400 rounded-full font-semibold shadow-lg"
              >
                Explore Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full font-semibold border border-white"
              >
                Watch Story
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-8 bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;