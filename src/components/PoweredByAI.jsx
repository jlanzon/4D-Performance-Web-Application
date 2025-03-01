import { motion } from 'framer-motion';

export default function PoweredByAI() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 bg-indigo-800 text-white"
    >
      <h2 className="text-4xl font-bold text-center mb-4">Powered by AI</h2>
      <p className="text-xl text-center mb-8">
        4D Leader leverages cutting-edge AI to deliver personalized, real-time coaching.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          {/* <img
            src="/images/ai-tailored.png" // Replace with your actual image path
            alt="AI Tailored Guidance"
            className="w-24 h-24 mx-auto mb-4"
          /> */}
          <p>Analyzes your behavior and feedback for tailored guidance.</p>
        </div>
        <div className="text-center">
          {/* <img
            src="/images/ai-decisions.png" // Replace with your actual image path
            alt="AI Decision-Making"
            className="w-24 h-24 mx-auto mb-4"
          /> */}
          <p>Advanced machine learning aids decision-making under pressure.</p>
        </div>
        <div className="text-center">
          {/* <img
            src="/images/ai-learning.png" // Replace with your actual image path
            alt="AI Continuous Learning"
            className="w-24 h-24 mx-auto mb-4"
          /> */}
          <p>Evolves with your needs through continuous learning.</p>
        </div>
      </div>
    </motion.section>
  );
}