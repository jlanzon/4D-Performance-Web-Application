import { motion } from "framer-motion";

export default function Hero(){
    return (
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-20 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to 4D Leader</h1>
        <p className="text-xl md:text-2xl mb-8">
          Your AI-powered executive coach, empowering leaders to perform with clarity, confidence, and resilience.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a
            href="/signup"
            className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </a>
          <a
            href="/scorecard"
            className="border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Take the Free Scorecard
          </a>
        </div>
      </motion.header>
    );
  };