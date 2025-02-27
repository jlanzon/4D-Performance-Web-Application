import React from 'react';
import Hero from '../../components/Hero';
import Footer from '../../components/Footer';
import Features from '../../components/Features';






export default function Home(){
  return (
    <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white min-h-screen flex flex-col">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};
