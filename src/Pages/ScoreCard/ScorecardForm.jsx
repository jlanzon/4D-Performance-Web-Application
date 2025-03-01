import React, { useState } from 'react';
import { scorecardData } from './scorecardData';
import WaitingList from '../../components/WaitingList';

const ScorecardForm = () => {
  // Dynamically compute initial answers based on scorecardData, defaulting each to 5
  const initialAnswers = Object.entries(scorecardData).reduce((acc, [category, data]) => {
    data.questions.forEach((_, index) => {
      acc[`${category}${index + 1}`] = 5;
    });
    return acc;
  }, {});

  const [answers, setAnswers] = useState(initialAnswers);
  const [feedback, setFeedback] = useState(null);

  // Calculate the average score for a given category
  const calculateAverage = (category) => {
    const categoryAnswers = Object.entries(answers)
      .filter(([key]) => key.startsWith(category))
      .map(([_, value]) => value);
    const sum = categoryAnswers.reduce((acc, val) => acc + val, 0);
    return sum / categoryAnswers.length;
  };

  // Determine feedback text based on the average (threshold at 6)
  const getFeedbackText = (category, average) => {
    const feedback = scorecardData[category].feedback;
    return average < 6 ? feedback.low : feedback.high;
  };

  const getColorClass = (average) => {
    if (average <= 3.0) return 'text-red-600';      // Red for scores ≤ 3
    if (average < 8.0) return 'text-yellow-600';    // Amber for scores > 3 and < 8
    return 'text-green-600';                        // Green for scores ≥ 8
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const categories = Object.keys(scorecardData);
    const categoryAverages = {};
    
    // Calculate averages for each category
    categories.forEach((category) => {
      categoryAverages[category] = calculateAverage(category);
    });
    
    // Calculate overall average
    const overallAverage = Object.values(categoryAverages).reduce((acc, avg) => acc + avg, 0) / categories.length;

    // Build feedback data object
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
  };

  // Handle changes to the range inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setAnswers((prev) => ({ ...prev, [name]: numValue }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Scorecard Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(scorecardData).map(([category, data]) => (
          <div key={category}>
            <h2 className="text-2xl font-semibold mb-2 capitalize text-black">
              {category} Intelligence
            </h2>
            {data.questions.map((question, index) => (
              <div key={index} className="mb-4">
                <label
                  htmlFor={`input-${category}${index + 1}`}
                  className="block mb-1 text-black"
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
                    className="w-full focus:ring focus:ring-blue-300"
                  />
                  <span className="ml-4 text-black">
                    {answers[`${category}${index + 1}`]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit Scorecard
        </button>
      </form>
      <WaitingList />
      {/* Feedback Section */}
      {feedback && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-black">
            Your 4D Intelligence Feedback
          </h2>
          <p className={`text-lg mb-6 ${getColorClass(feedback.overall)}`}>
            Overall Score: {feedback.overall.toFixed(1)}/10
          </p>
          {Object.entries(feedback)
            .filter(([key]) => key !== 'overall')
            .map(([category, data]) => (
              <div key={category} className="mb-6">
                <h3
                  className={`text-xl font-semibold capitalize ${getColorClass(
                    data.average
                  )}`}
                >
                  {category} Intelligence: {data.average.toFixed(1)}/10
                </h3>
                <p className="text-black mt-1">{data.feedbackText}</p>
              </div>
            ))}
        </div>
      )}       

    </div>
  );
};

export default ScorecardForm;