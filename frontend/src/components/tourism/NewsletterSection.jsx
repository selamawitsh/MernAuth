import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NewsletterSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get the latest travel updates, exclusive offers, and insider tips delivered to your inbox
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
            <Button className="bg-white text-green-600 hover:bg-gray-100">
              Subscribe
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;