import React, { Suspense } from 'react';
import Hero from '../../components/Hero';
import Features from '../../components/Features';
import PoweredByAI from '../../components/PoweredByAI';
import CallToAction from '../../components/CallToAction'; // Adjust path as needed
import Testimonials from '../../components/Testimonials';
import Footer from '../../components/Footer';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen flex flex-col">
      <div
        className="bg-[#d8d8d88e] dark:bg-stone-900 text-black dark:text-stone-100 relative py-16 overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(200,200,200,0.1) 0%, transparent 20%),
            radial-gradient(circle at 80% 20%, rgba(200,200,200,0.1) 0%, transparent 20%),
            url("./seamless-texture-crumpled-paper-free-thumb36.jpg")
          `,
          backgroundRepeat: 'repeat',
          backgroundBlendMode: 'overlay',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05), inset 0 -2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <Hero />
      </div>

      <div className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 flex-1">
        <div className="container mx-auto py-12 space-y-12">
          <div className="bg-white dark:bg-stone-700 shadow-md rounded-lg p-6">
            <Features />
          </div>
          <div className="bg-white dark:bg-stone-700 shadow-md rounded-lg p-6">
            <PoweredByAI />
          </div>
          
          <div className="bg-white dark:bg-stone-700 shadow-md rounded-lg p-6">
            <Testimonials />
          </div>
        </div>
      </div>

            <CallToAction />
    </div>
    </Suspense>
  );
}