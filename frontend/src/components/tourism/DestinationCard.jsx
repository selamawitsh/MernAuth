import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Clock, Heart, Star, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DestinationCard = ({ destination, index }) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -10 }}
      className="group cursor-pointer"
    >
      <Card className="overflow-hidden h-full hover:shadow-2xl transition-all duration-300">
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white text-xl font-bold">{destination.name}</h3>
            <p className="text-gray-200 text-sm flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {destination.region} Region
            </p>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {destination.description}
          </p>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{destination.duration}</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <Heart className="w-4 h-4" />
              <span className="text-sm">124</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-green-600">
                ${destination.price}
              </span>
              <span className="text-gray-500">/person</span>
            </div>
            <Button variant="outline" className="group-hover:bg-green-500 group-hover:text-white transition-all">
              Book Now
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DestinationCard;