import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  ArrowRight,
  Globe,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react';

interface ContactProps {
  onOpenForm: () => void;
}

const Contact: React.FC<ContactProps> = ({ onOpenForm }) => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Office',
      details: ['123 Business District', 'New York, NY 10001', 'United States'],
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      color: 'emerald'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['hello@clientdesk.com', 'support@clientdesk.com'],
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM', 'Sun: Closed'],
      color: 'orange'
    }
  ];

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Globe, href: '#', label: 'Website' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to start your project? We'd love to hear from you. 
            Contact us today and let's bring your ideas to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Let's Start a Conversation
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Whether you have a specific project in mind or just want to explore possibilities, 
                we're here to help. Our team of experts is ready to discuss your needs and 
                provide tailored solutions.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div 
                    key={index}
                    className="p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-lg ${getColorClasses(info.color)} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {info.title}
                    </h4>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="lg:pl-8">
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 p-8 rounded-2xl">
              <div className="text-center mb-8">
                <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Fill out our inquiry form and we'll get back to you within 24 hours 
                  with a detailed proposal tailored to your needs.
                </p>
              </div>

              <button
                onClick={onOpenForm}
                className="w-full group bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24h</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">Free</div>
                    <div className="text-sm text-gray-600">Consultation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3">
                What Happens Next?
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    1
                  </div>
                  <p className="text-sm text-gray-600">
                    We'll review your inquiry and contact you within 24 hours
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    2
                  </div>
                  <p className="text-sm text-gray-600">
                    Schedule a free consultation to discuss your project in detail
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    3
                  </div>
                  <p className="text-sm text-gray-600">
                    Receive a detailed proposal with timeline and pricing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;