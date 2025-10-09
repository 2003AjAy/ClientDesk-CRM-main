import React from 'react';
import { 
  Code, 
  Smartphone, 
  Palette, 
  Shield, 
  Zap, 
  Users, 
  Clock, 
  Award,
  CheckCircle 
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies and best practices.',
      color: 'blue'
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications for iOS and Android devices.',
      color: 'emerald'
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive designs that enhance user experience and drive engagement.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Enterprise-grade security measures to protect your data and users.',
      color: 'red'
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Agile development process ensuring quick turnaround without compromising quality.',
      color: 'yellow'
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Round-the-clock technical support and maintenance for your peace of mind.',
      color: 'indigo'
    }
  ];

  const stats = [
    { number: '500+', label: 'Projects Completed' },
    { number: '200+', label: 'Happy Clients' },
    { number: '50+', label: 'Team Members' },
    { number: '5+', label: 'Years Experience' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Client Desk?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine technical expertise with creative vision to deliver exceptional 
            digital solutions that drive your business forward.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200"
              >
                <div className={`w-14 h-14 rounded-xl ${getColorClasses(feature.color)} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Trusted by Businesses Worldwide
            </h3>
            <p className="text-blue-100 text-lg">
              Our track record speaks for itself
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Simple Process
            </h3>
            <p className="text-xl text-gray-600">
              From idea to launch, we make it seamless
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', desc: 'We understand your needs and goals' },
              { step: '02', title: 'Planning', desc: 'Strategic roadmap and timeline creation' },
              { step: '03', title: 'Development', desc: 'Building your solution with precision' },
              { step: '04', title: 'Launch', desc: 'Deployment and ongoing support' }
            ].map((process, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {process.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {process.desc}
                </p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;