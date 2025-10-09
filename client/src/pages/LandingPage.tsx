import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import InquiryForm from '../components/InquiryForm';

const LandingPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onOpenForm={handleOpenForm} />
      <Hero onOpenForm={handleOpenForm} />
      <Features />
      <Testimonials />
      <Contact onOpenForm={handleOpenForm} />
      <Footer onOpenForm={handleOpenForm} />
      <InquiryForm isOpen={isFormOpen} onClose={handleCloseForm} />
    </div>
  );
};

export default LandingPage; 