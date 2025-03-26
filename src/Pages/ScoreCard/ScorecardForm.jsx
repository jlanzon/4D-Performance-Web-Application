import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { scorecardData } from './scorecardData';
import WaitingList from '../../components/WaitingList';
import { DarkModeContext } from '../../context/Theme';
import { FiArrowRight } from 'react-icons/fi';

const ScorecardForm = ({ onSubmit }) => {
  const { isDark } = useContext(DarkModeContext);
  const initialAnswers = Object.entries(scorecardData).reduce((acc, [category, data]) => {
    data.questions.forEach((_, index) => {
      acc[`${category}${index + 1}`] = 5;
    });
    return acc;
  }, {});

  const [answers, setAnswers] = useState(initialAnswers);
  const [feedback, setFeedback] = useState(null);

  const calculateAverage = (category) => {
    const categoryAnswers = Object.entries(answers)
      .filter(([key]) => key.startsWith(category))
      .map(([_, value]) => value);
    const sum = categoryAnswers.reduce((acc, val) => acc + val, 0);
    return sum / categoryAnswers.length;
  };

  const getFeedbackText = (category, average) => {
    const feedback = scorecardData[category].feedback;
    return average < 6 ? feedback.low : feedback.high;
  };

  const getColorClass = (average) => {
    if (average <= 3.0) return 'text-red-600';
    if (average < 8.0) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categories = Object.keys(scorecardData);
    const categoryAverages = {};
    
    categories.forEach((category) => {
      categoryAverages[category] = calculateAverage(category);
    });
    
    const overallAverage = Object.values(categoryAverages).reduce((acc, avg) => acc + avg, 0) / categories.length;

    const feedbackData = {
      overall: overallAverage,
      ...Object.fromEntries(
        categories.map((category) => [
          category,
          {
            average: categoryAverages[category],
            feedbackText: getFeedbackText(category, categoryAverages[category]),
          },
        ])
      ),
    };
    
    setFeedback(feedbackData);
    onSubmit(answers); // Pass answers to parent component
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setAnswers((prev) => ({ ...prev, [name]: numValue }));
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        {Object.entries(scorecardData).map(([category, data]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`p-6 rounded-2xl shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 capitalize bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
              {category} Intelligence
            </h2>
            {data.questions.map((question, index) => (
              <div key={index} className="mb-6">
                <label
                  htmlFor={`input-${category}${index + 1}`}
                  className={`block mb-2 text-base md:text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
                >
                  {question}
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id={`input-${category}${index + 1}`}
                    min="1"
                    max="10"
                    step="1"
                    name={`${category}${index + 1}`}
                    value={answers[`${category}${index + 1}`]}
                    onChange={handleChange}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
                  />
                  <span className={`ml-4 text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {answers[`${category}${index + 1}`]}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        ))}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className={`group flex items-center gap-2 rounded-full px-6 py-3 text-lg font-medium ${
            isDark
              ? 'bg-gray-950/10 text-gray-50 hover:bg-gray-950/50'
              : 'bg-gray-950/10 text-gray-900 hover:bg-gray-950/20'
          }`}
        >
          Submit Scorecard
          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
        </motion.button>
      </form>
      <WaitingList />
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            Your 4D Intelligence Feedback
          </h2>
          <p className={`text-lg md:text-xl mb-6 font-semibold ${getColorClass(feedback.overall)}`}>
            Overall Score: {feedback.overall.toFixed(1)}/10
          </p>
          {Object.entries(feedback)
            .filter(([key]) => key !== 'overall')
            .map(([category, data]) => (
              <div key={category} className="mb-6">
                <h3 className={`text-xl md:text-2xl font-semibold capitalize ${getColorClass(data.average)}`}>
                  {category} Intelligence: {data.average.toFixed(1)}/10
                </h3>
                <p className={`mt-2 text-base md:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {data.feedbackText}
                </p>
              </div>
            ))}
        </motion.div>
      )}
    </div>
  );
};

export default ScorecardForm;