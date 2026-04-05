import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PackagesSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  
  const packages = [
    {
      name: 'Northern Circuit',
      duration: '10 Days',
      price: 1299,
      features: ['Lalibela Churches', 'Gondar Castles', 'Axum Obelisks', 'Simien Mountains'],
      popular: true
    },
    {
      name: 'Historical Route',
      duration: '7 Days',
      price: 899,
      features: ['Lalibela', 'Gondar', 'Axum', 'Bahir Dar'],
      popular: false
    },
    {
      name: 'Nature & Wildlife',
      duration: '8 Days',
      price: 1099,
      features: ['Simien Mountains', 'Bale Mountains', 'Lake Tana', 'Bird Watching'],
      popular: false
    }
  ];

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="bg-green-100 text-green-600 mb-4">Travel Packages</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect
            <span className="block text-green-600">Travel Experience</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select from our carefully curated packages designed for unforgettable adventures
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-green-500 to-yellow-400 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card className={`h-full overflow-hidden transition-all duration-300 hover:shadow-2xl ${pkg.popular ? 'border-2 border-green-500' : ''}`}>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-green-600">${pkg.price}</span>
                    <span className="text-gray-500">/person</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-yellow-400 text-white">
                    Book This Package
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;