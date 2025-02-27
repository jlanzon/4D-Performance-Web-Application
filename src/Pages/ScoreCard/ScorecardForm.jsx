import React, { useState } from 'react';
import { scorecardData } from './scorecardData';

const ScorecardForm = ({ onSubmit }) => {
  const [answers, setAnswers] = useState({
    cognitive1: 5,
    cognitive2: 5,
    physical1: 5,
    physical2: 5,
    emotional1: 5,
    emotional2: 5,
    spiritual1: 5,
    spiritual2: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setAnswers({ ...answers, [name]: numValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.entries(scorecardData).map(([category, data]) => (
        <div key={category}>
          <h2 className="text-2xl font-semibold mb-2 capitalize text-black">{category} Intelligence</h2>
          {data.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <label htmlFor={`input-${category}${index + 1}`} className="block mb-1 text-black">
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
                <span className="ml-4 text-black">{answers[`${category}${index + 1}`]}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Submit Scorecard
      </button>
    </form>
  );
};

export default ScorecardForm;