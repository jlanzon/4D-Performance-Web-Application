import { motion } from 'framer-motion';

export default function PoweredByAI() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 bg-gradient-to-br from-stone-50 to-stone-200 dark:from-stone-800 dark:to-stone-900 text-stone-900 dark:text-stone-100 relative overflow-hidden"
    >
      <h2 className="text-4xl font-bold text-center mb-4 text-stone-800 dark:text-white tracking-tight">
        Powered by AI
      </h2>
      <p className="text-xl text-center mb-8 text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
        4D Leader leverages cutting-edge AI to deliver personalised, real-time coaching.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          whileHover={{ scale: 1.05, rotate: 1 }}
          className="relative text-center p-6 bg-white/80 dark:bg-stone-700/80 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <img
            src="./hr1.jpg"
            alt="AI Tailored Guidance"
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900 dark:to-stone-800"
            style={{ mixBlendMode: 'overlay' }}
          />
          <div className="relative z-10 pt-48">
            <p className="text-stone-100 dark:text-stone-200 text-lg font-medium">
              Analyses your behavior and feedback for tailored guidance.
            </p>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, rotate: -1 }}
          className="relative text-center p-6 bg-white/80 dark:bg-stone-700/80 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <img
            src="./hr2.jpg"
            alt="AI Decision-Making"
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900 dark:to-stone-800"
            style={{ mixBlendMode: 'overlay' }}
          />
          <div className="relative z-10 pt-48">
            <p className="text-stone-100 dark:text-stone-200 text-lg font-medium">
              Advanced machine learning aids decision-making under pressure.
            </p>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 1 }}
          className="relative text-center p-6 bg-white/80 dark:bg-stone-700/80 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <img
            src="./hr3.jpg"
            alt="AI Continuous Learning"
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
            loading="lazy"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-900 dark:to-stone-800"
            style={{ mixBlendMode: 'overlay' }}
          />
          <div className="relative z-10 pt-48">
            <p className="text-stone-100 dark:text-stone-200 text-lg font-medium">
              Evolves with your needs through continuous learning.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}