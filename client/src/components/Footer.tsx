import React from 'react';
import { 
  Code, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Github, 
  Globe,
  ArrowRight,
  Heart
} from 'lucide-react';

interface FooterProps {
  onOpenForm: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenForm }) => {
  const services = [
    'Web Development',
    'Mobile Apps',
    'UI/UX Design',
    'E-commerce',
    'Consulting',
    'Maintenance'
  ];

  const company = [
    'About Us',
    'Our Team',
    'Careers',
    'Portfolio',
    'Blog',
    'Contact'
  ];

  const resources = [
    'Documentation',
    'Help Center',
    'Privacy Policy',
    'Terms of Service',
    'Cookie Policy',
    'GDPR'
  ];

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Globe, href: '#', label: 'Website' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Client Desk</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Transforming ideas into exceptional digital experiences. 
              We help businesses grow through innovative web and mobile solutions.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-3" />
                <span className="text-sm">hello@clientdesk.com</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-3" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-3" />
                <span className="text-sm">New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {company.map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3 mb-8">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {resource}
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest news and updates from our team.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded-l-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-lg transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who have transformed their businesses with our solutions.
            </p>
            <button
              onClick={onOpenForm}
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-gray-400 text-sm mb-4 md:mb-0">
              <span>© 2024 Client Desk. Made with</span>
              <Heart className="w-4 h-4 text-red-500 mx-1 fill-current" />
              <span>in New York</span>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-8 h-8 bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;