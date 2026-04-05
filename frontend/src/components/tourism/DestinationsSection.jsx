import { motion } from 'framer-motion';
import { MapPin, Star, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DestinationsSection = () => {
  const destinations = [
    {
      id: 1,
      name: 'Simien Mountains',
      region: 'Amhara',
      image: 'https://i.pinimg.com/736x/1b/5b/9d/1b5b9da91a707b0ae9a9aae2c617b84a.jpg',
      rating: 4.8,
      duration: '3-5 days',
      price: '$250',
      description: 'Experience the breathtaking landscapes of Ethiopia\'s highest mountains.'
    },
    {
      id: 2,
      name: 'Lalibela Rock Churches',
      region: 'Amhara',
      image: 'https://i.pinimg.com/736x/fe/ab/db/feabdbd7ed3fd59843169e3f50a04dc5.jpg',
      rating: 4.9,
      duration: '2-3 days',
      price: '$180',
      description: 'Explore the UNESCO World Heritage rock-hewn churches.'
    },
    {
      id: 3,
      name: 'Axum Obelisks',
      region: 'Tigray',
      image: 'https://i.pinimg.com/736x/21/d2/d6/21d2d63d95c0d8a30eebcea15d079435.jpg',
      rating: 4.7,
      duration: '1-2 days',
      price: '$120',
      description: 'Discover the ancient obelisks and archaeological wonders.'
    }
  ];

  return (
    <section id="destinations" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Popular Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most breathtaking destinations across Ethiopia, each offering unique experiences and unforgettable memories.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden h-64">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-900">
                      <Star className="w-3 h-3 text-yellow-500 inline mr-1" />
                      {destination.rating}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {destination.region}
                  </p>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {destination.duration}
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {destination.price}
                    </span>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Explore Destination
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            View All Destinations
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default DestinationsSection;