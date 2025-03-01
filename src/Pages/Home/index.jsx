import React from 'react';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import PoweredByAI from '../../components/PoweredByAI';
import Testimonials from '../../components/Testimonials';
import Footer from '../../components/Footer';

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white min-h-screen flex flex-col">
      <Hero />
      <Features />
      <PoweredByAI />
      <Testimonials />
      <Footer />
    </div>
  );
}