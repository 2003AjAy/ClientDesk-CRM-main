import React from 'react';
import { ArrowRight, Users, CheckCircle, Star } from 'lucide-react';

interface HeroProps {
  onOpenForm: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenForm }) => {
  return (
    <section id="home" className="relative bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                <Star className="w-4 h-4 mr-2" />
                Trusted by 500+ clients worldwide
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600"> Ideas</span>
                <br />
                Into Reality
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                We help businesses bring their digital visions to life with cutting-edge web development, 
                mobile apps, and innovative solutions tailored to your unique needs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onOpenForm}
                className="group inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200">
                View Our Work
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
            </div>
          </div>

          {/* Right column - Visual */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Team</h3>
                    <p className="text-sm text-gray-600">Skilled developers & designers</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quality Assured</h3>
                    <p className="text-sm text-gray-600">Rigorous testing & optimization</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Ready to get started?</p>
                    <button
                      onClick={onOpenForm}
                      className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    >
                      Tell us about your project →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full opacity-20 animate-bounce delay-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;