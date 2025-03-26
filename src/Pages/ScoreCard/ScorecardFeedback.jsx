import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { scorecardData } from './scorecardData';
import { DarkModeContext } from '../../context/Theme';
import { FiArrowRight } from 'react-icons/fi';

const ScorecardFeedback = ({ scores, onRetake }) => {
  const { isDark } = useContext(DarkModeContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`p-6 rounded-2xl shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
        Your Score
      </h2>
      <ul className="mb-6 space-y-4">
        {Object.entries(scores).map(([category, score]) => (
          <li key={category} className="text-lg md:text-xl">
            <strong className={`capitalize ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              {category} Intelligence:
            </strong>{' '}
            <span className={score < 5 ? 'text-red-600' : 'text-green-600'}>{score} / 10</span>
          </li>
        ))}
      </ul>
      <div className="mb-6">
        <p className={`text-base md:text-lg font-medium mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          Based on your scores, here are some tailored insights:
        </p>
        <ul className="space-y-3 text-base md:text-lg list-disc list-inside">
          {Object.entries(scores).map(([category, score]) => {
            const feedback = scorecardData[category].feedback;
            return (
              <li key={category} className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {score < 5 ? feedback.low : feedback.high}
              </li>
            );
          })}
        </ul>
      </div>
      <motion.button
        onClick={onRetake}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        className={`group flex items-center gap-2 rounded-full px-6 py-3 text-lg font-medium ${
          isDark
            ? 'bg-gray-950/10 text-gray-50 hover:bg-gray-950/50'
            : 'bg-gray-950/10 text-gray-900 hover:bg-gray-950/20'
        }`}
      >
        Retake Quiz
        <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
      </motion.button>
    </motion.div>
  );
};

export default ScorecardFeedback;