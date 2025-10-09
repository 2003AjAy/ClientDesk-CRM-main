import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'Client Desk transformed our digital presence completely. Their team delivered beyond our expectations with exceptional attention to detail and professionalism.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Founder, GrowthLab',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'The mobile app they developed for us increased our user engagement by 300%. Outstanding work and incredible support throughout the entire process.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director, InnovateCorp',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      content: 'Working with Client Desk was a game-changer. They understood our vision perfectly and delivered a solution that exceeded all our requirements.',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about working with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4 pt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-gray-600 mb-6">
              Let's discuss how we can help transform your business
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>4.9/5 average rating from 200+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;