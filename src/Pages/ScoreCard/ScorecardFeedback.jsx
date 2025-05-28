import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { scorecardData } from './scorecardData';
import { DarkModeContext } from '../../context/Theme';
import { FiArrowRight } from 'react-icons/fi';
import WaitingListModal from '../../components/WaitingListModal'; 


const ScorecardFeedback = ({ scores, onRetake }) => {
  const { isDark } = useContext(DarkModeContext);
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (category) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const averageScore = (
    Object.values(scores).reduce((sum, score) => sum + parseFloat(score), 0) /
    Object.keys(scores).length
  ).toFixed(1);

  return (
    <div
      className={`p-8 rounded-2xl shadow-xl ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent"
      >
        Your Leadership Score
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`text-lg mb-6 font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        Average Score: <span className={averageScore < 5 ? 'text-red-500' : 'text-green-500'}>{averageScore} / 10</span>
      </motion.p>
      <ul className="mb-8 space-y-6" role="list">
        {Object.entries(scores).map(([category, score]) => (
          <li key={category} className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <strong
                className={`capitalize text-xl font-semibold ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                }`}
              >
                {category} Intelligence: {score} / 10
              </strong>
              <button
                onClick={() => toggleExpand(category)}
                className={`text-sm font-medium ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                }`}
                aria-expanded={expanded[category] || false}
                aria-controls={`${category}-feedback`}
              >
                {expanded[category] ? 'Hide' : 'Show'} Insights
              </button>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    score < 5 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(score / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            {expanded[category] && (
              <motion.div
                id={`${category}-feedback`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`mt-3 text-base ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {score < 5
                  ? scorecardData[category].feedback.low
                  : scorecardData[category].feedback.high}
              </motion.div>
            )}
          </li>
        ))}
      </ul>
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          onClick={onRetake}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`group flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-lg font-semibold ${
            isDark
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Retake Quiz
          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
        </motion.button>
        <WaitingListModal />
      </div>
    </div>
  );
};

export default ScorecardFeedback;