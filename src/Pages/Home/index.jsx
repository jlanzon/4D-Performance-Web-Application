import React from 'react';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import PoweredByAI from '../../components/PoweredByAI';
import Testimonials from '../../components/Testimonials';
import Footer from '../../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Dark Gradient */}
      <div className="bg-gradient-to-r bg-gray-300 text-black">
        <Hero />
      </div>

      {/* Main Content with Paper-Like Sections */}
      <div className="bg-gray-100 text-gray-900 flex-1">
        <div className="container mx-auto py-12 space-y-12">
          <div className="bg-white shadow-md rounded-lg p-6">
            <Features />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <PoweredByAI />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <Testimonials />
          </div>
        </div>
      </div>

      {/* Footer with Dark Gradient */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
        <Footer />
      </div>
    </div>
  );
}