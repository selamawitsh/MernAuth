import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote, Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const TestimonialsSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  
  const testimonials = [
    {
      name: 'Mahlet Samson',
      country: 'USA',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      text: 'An incredible experience! The team was professional and the itinerary was perfect. Ethiopia exceeded all my expectations.',
      rating: 5
    },
    {
      name: 'Daniel Kebede',
      country: 'Ethiopia',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      text: 'The historical sites are breathtaking. Our guide was knowledgeable and made the trip memorable. Highly recommended!',
      rating: 5
    },
    {
      name: 'Selamawit Shimeles',
      country: 'Addis Ababa',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      text: 'Best travel experience of my life! The landscapes, the people, the food - everything was perfect. Will come back!',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-green-600 to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Quote className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Real experiences from people who traveled with us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={testimonial.image} />
                  <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-300">{testimonial.country}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-200">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;