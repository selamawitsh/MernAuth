import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Map, Calendar, Award } from 'lucide-react';
import useCountUp from '../../hooks/useCountUp';

const StatsSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  
  const stats = [
    { icon: Users, value: 12500, label: 'Happy Travelers', suffix: '+' },
    { icon: Map, value: 50, label: 'Destinations', suffix: '+' },
    { icon: Calendar, value: 8, label: 'Years Experience', suffix: '' },
    { icon: Award, value: 98, label: 'Satisfaction Rate', suffix: '%' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-green-500 to-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {inView ? <CountUpValue end={stat.value} suffix={stat.suffix} /> : '0'}
              </div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CountUp Component
const CountUpValue = ({ end, suffix }) => {
  const count = useCountUp(end);
  return <>{count}{suffix}</>;
};

export default StatsSection;