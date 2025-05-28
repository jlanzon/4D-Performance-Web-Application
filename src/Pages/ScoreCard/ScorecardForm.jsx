import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { DarkModeContext } from '../../context/Theme';
import { FiArrowRight } from 'react-icons/fi';
import WaitingList from '../../components/WaitingList';
import { scorecardData } from './scorecardData';

const ScorecardForm = ({ onSubmit }) => {
  const { isDark } = useContext(DarkModeContext);
  const [isSimpleMode, setIsSimpleMode] = useState(false); // Toggle state for Simple/Complex mode

  const initialAnswers = Object.entries(scorecardData).reduce((acc, [category, data]) => {
    data.questions.forEach((_, index) => {
      acc[`${category}${index + 1}`] = 3; // Default to Neutral (3)
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
    return average < 3 ? feedback.low : feedback.high;
  };

  const getColorClass = (average) => {
    if (average <= 2.0) return 'text-red-600';
    if (average < 4.0) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categories = Object.keys(scorecardData);
    const categoryAverages = {};

    categories.forEach((category) => {
      categoryAverages[category] = calculateAverage(category).toFixed(1);
    });

    const overallAverage = (
      Object.values(categoryAverages).reduce((acc, avg) => acc + parseFloat(avg), 0) /
      categories.length
    ).toFixed(1);

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
    onSubmit(categoryAverages); // Pass category averages to parent component
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setAnswers((prev) => ({ ...prev, [name]: numValue }));
  };

  const toggleMode = () => {
    setIsSimpleMode((prev) => !prev);
  };

  return (
    <div className="w-full relative">
      {/* Toggle Switch */}
      <div className="absolute top-0 right-0 flex items-center space-x-2">
        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {isSimpleMode ? 'Simple' : 'Complex'}
        </span>
        <button
          onClick={toggleMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            isSimpleMode
              ? isDark
                ? 'bg-green-500'
                : 'bg-green-400'
              : isDark
              ? 'bg-gray-600'
              : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              isSimpleMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pt-10">
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
            {data.questions
              .slice(0, isSimpleMode ? 2 : data.questions.length) // Show only first 2 questions in Simple mode
              .map((question, index) => (
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
                      max="5"
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
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>Strongly Disagree</span>
                    <span>Strongly Agree</span>
                  </div>
                </div>
              ))}
          </motion.div>
        ))}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className={`group my-2 flex items-center gap-2 rounded-full px-6 py-3 text-lg font-medium ${
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
            Your 4D Leadership Intelligence Profile
          </h2>
          <p className={`text-lg md:text-xl mb-6 font-semibold ${getColorClass(feedback.overall)}`}>
            Overall Score: {feedback.overall}/5
          </p>
          {Object.entries(feedback)
            .filter(([key]) => key !== 'overall')
            .map(([category, data]) => (
              <div key={category} className="mb-6">
                <h3 className={`text-xl md:text-2xl font-semibold capitalize ${getColorClass(data.average)}`}>
                  {category} Intelligence: {data.average}/5
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