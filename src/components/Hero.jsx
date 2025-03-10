import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center text-stone-900 dark:text-stone-100"
    >
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-stone-900 dark:text-white">
          Welcome to 4D Leader
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-stone-700 dark:text-stone-300">
          Your AI-powered executive coach, empowering leaders to perform with clarity, confidence, and resilience.
        </p>
        <div className="flex flex-col md:flex-row justify-center md:justify-start gap-4">
          <a
            href="/signup"
            className="bg-white dark:bg-stone-800 text-blue-600 dark:text-blue-300 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition duration-300"
          >
            Get Started
          </a>
          <a
            href="/scorecard"
            className="border border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100 font-semibold py-3 px-6 rounded-lg hover:bg-stone-900 dark:hover:bg-stone-100 hover:text-white dark:hover:text-stone-900 transition duration-300"
          >
            Take the Free Scorecard
          </a>
        </div>
      </div>
      <div className="md:w-1/2 mt-8 md:mt-0">
      <img src="./hero.webp" alt="Leader using 4D Leader platform" className="w-full h-auto rounded-lg shadow-lg" />
      </div>
    </motion.header>
  );
}