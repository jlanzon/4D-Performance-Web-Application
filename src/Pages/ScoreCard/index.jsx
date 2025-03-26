import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import ScorecardForm from './ScorecardForm';
import ScorecardFeedback from './ScorecardFeedback';
import { DarkModeContext } from '../../context/Theme';

const Scorecard = () => {
  const { isDark } = useContext(DarkModeContext); // Access dark mode context
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState({});

  const handleSubmit = (answers) => {
    const cognitive = ((answers.cognitive1 + answers.cognitive2) / 2).toFixed(1);
    const physical = ((answers.physical1 + answers.physical2) / 2).toFixed(1);
    const emotional = ((answers.emotional1 + answers.emotional2) / 2).toFixed(1);
    const spiritual = ((answers.spiritual1 + answers.spiritual2) / 2).toFixed(1);
    setScores({ cognitive, physical, emotional, spiritual });
    setSubmitted(true);
  };

  const retakeQuiz = () => {
    setSubmitted(false);
    setScores({});
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`min-h-screen flex flex-col items-center justify-center p-6 md:p-8 ${
        isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className={`w-full max-w-4xl rounded-2xl mt-22 shadow-xl p-8 ${
          isDark
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          4D Leadership Intelligence Scorecard
        </h1>
        <p className="text-center text-base md:text-lg mb-8 text-gray-600 dark:text-gray-400">
          Assess your leadership across four dimensions with our AI-powered tool.
        </p>

        {!submitted ? (
          <ScorecardForm onSubmit={handleSubmit} />
        ) : (
          <ScorecardFeedback scores={scores} onRetake={retakeQuiz} />
        )}
      </motion.div>

      {/* Decorative Background Elements */}
      
    </motion.div>
  );
};

export default Scorecard;