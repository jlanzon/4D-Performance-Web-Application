import React from 'react';
import { scorecardData } from './scorecardData';

const ScorecardFeedback = ({ scores, onRetake }) => {
  return (
    <div className="text-black">
      <h2 className="text-2xl font-bold mb-4">Your Score</h2>
      <ul className="mb-4">
        {Object.entries(scores).map(([category, score]) => (
          <li key={category}>
            <strong>{category.charAt(0).toUpperCase() + category.slice(1)} Intelligence:</strong>{' '}
            {score} / 10
          </li>
        ))}
      </ul>
      <div className="mb-4">
        <p className="mb-2">Based on your scores, here are some tailored insights:</p>
        <ul className="list-disc list-inside">
          {Object.entries(scores).map(([category, score]) => {
            const feedback = scorecardData[category].feedback;
            return score < 5 ? (
              <li key={category}>{feedback.low}</li>
            ) : (
              <li key={category}>{feedback.high}</li>
            );
          })}
        </ul>
      </div>
      <button onClick={onRetake} className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700">
        Retake Quiz
      </button>
    </div>
  );
};

export default ScorecardFeedback;