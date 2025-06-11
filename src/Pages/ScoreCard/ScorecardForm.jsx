import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { DarkModeContext } from '../../context/Theme';
import { FiArrowRight } from 'react-icons/fi';
import WaitingList from '../../components/WaitingList';
import { scorecardData } from './scorecardData';

const ScorecardForm = ({ onSubmit }) => {
  const { isDark } = useContext(DarkModeContext);
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [skipped, setSkipped] = useState({});

  const initialAnswers = Object.entries(scorecardData).reduce((acc, [category, data]) => {
    data.questions.forEach((_, index) => {
      acc[`${category}${index + 1}`] = 5; // Default to 5 (middle of 0–10)
    });
    return acc;
  }, {});

  const [answers, setAnswers] = useState(initialAnswers);
  const [feedback, setFeedback] = useState(null);

  const calculateAverage = (category) => {
    const categoryAnswers = Object.entries(answers)
      .filter(([key]) => key.startsWith(category) && !skipped[key])
      .map(([_, value]) => value);
    const sum = categoryAnswers.reduce((acc, val) => acc + val, 0);
    return categoryAnswers.length ? (sum / categoryAnswers.length).toFixed(1) : 0;
  };

  const getFeedbackText = (category, average) => {
    const feedback = scorecardData[category].feedback;
    return average < 5 ? feedback.low : feedback.high;
  };

  const getColorClass = (average) => {
    if (average <= 4.0) return 'text-red-600';
    if (average < 8.0) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categories = Object.keys(scorecardData);
    const categoryData = {};

    categories.forEach((category) => {
      const categoryAnswers = Object.entries(answers)
        .filter(([key]) => key.startsWith(category))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      const skippedQuestions = Object.entries(skipped)
        .filter(([key]) => key.startsWith(category))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
      categoryData[category] = {
        score: calculateAverage(category),
        answers: categoryAnswers,
        skipped: skippedQuestions,
      };
    });

    const overallAverage = (
      Object.values(categoryData)
        .filter((data) => parseFloat(data.score) > 0)
        .reduce((acc, data) => acc + parseFloat(data.score), 0) /
      categories.length
    ).toFixed(1);

    const feedbackData = {
      overall: overallAverage,
      ...Object.fromEntries(
        categories.map((category) => [
          category,
          {
            average: categoryData[category].score,
            feedbackText: getFeedbackText(category, categoryData[category].score),
          },
        ])
      ),
    };

    setFeedback(feedbackData);
    onSubmit(categoryData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setAnswers((prev) => ({ ...prev, [name]: numValue }));
  };

  const toggleMode = () => {
    setIsSimpleMode((prev) => !prev);
  };

  const handleSkip = (key) => {
    setSkipped((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full relative z-[1000]">
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
              .slice(0, isSimpleMode ? 2 : data.questions.length)
              .map((question, index) => {
                const key = `${category}${index + 1}`;
                const isSkipped = skipped[key];
                return (
                  <div key={index} className="mb-6">
                    <label
                      htmlFor={`input-${key}`}
                      className={`block mb-2 text-base md:text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
                    >
                      {question}
                    </label>
                    <div className="flex items-center gap-4">
                      {isSkipped ? (
                        <div className="flex-1 text-gray-400 italic">Skipped</div>
                      ) : (
                        <>
                          <input
                            type="range"
                            id={`input-${key}`}
                            min="0"
                            max="10"
                            step="1"
                            name={key}
                            value={answers[key]}
                            onChange={handleChange}
                            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                              isDark ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                            disabled={isSkipped}
                          />
                          <span className={`ml-2 text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                            {answers[key]}
                          </span>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSkip(key)}
                        className={`ml-2 px-3 py-1 rounded text-sm font-semibold border ${
                          isSkipped
                            ? isDark
                              ? 'bg-blue-700 text-white border-blue-600 hover:bg-blue-600'
                              : 'bg-blue-200 text-blue-800 border-blue-400 hover:bg-blue-300'
                            : isDark
                            ? 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-800 border-gray-400 hover:bg-gray-300'
                        }`}
                      >
                        {isSkipped ? 'Unskip' : 'Skip'}
                      </button>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>Strongly Disagree</span>
                      <span>Strongly Agree</span>
                    </div>
                  </div>
                );
              })}
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
            Overall Score: {feedback.overall}/10
          </p>
          {Object.entries(feedback)
            .filter(([key]) => key !== 'overall')
            .map(([category, data]) => (
              <div key={category} className="mb-6">
                <h3 className={`text-xl md:text-2xl font-semibold capitalize ${getColorClass(data.average)}`}>
                  {category} Intelligence: {data.average}/10
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