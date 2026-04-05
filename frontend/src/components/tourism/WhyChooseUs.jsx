import React from 'react';
import { Shield, Award, Headphones, Globe } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    { icon: Shield, title: 'Safe & Secure', description: 'Your safety is our top priority with 24/7 support' },
    { icon: Award, title: 'Best Price Guarantee', description: 'We offer competitive prices with no hidden fees' },
    { icon: Headphones, title: '24/7 Customer Support', description: 'Our team is always ready to assist you' },
    { icon: Globe, title: 'Local Experts', description: 'Authentic experiences with local guides' }
  ];

  return (
    <section id="whyus" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full inline-block mb-4 font-medium">
            Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Travel With Us?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide unforgettable experiences with professional service and local expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all">
                <feature.icon className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;