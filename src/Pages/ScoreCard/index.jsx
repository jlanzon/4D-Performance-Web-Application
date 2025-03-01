import React, { useState } from 'react';
import ScorecardForm from './ScorecardForm';
import ScorecardFeedback from './ScorecardFeedback';

const Scorecard = () => {
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
    <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-black">4D Leadership Intelligence Scorecard</h1>
        {!submitted ? (
          <ScorecardForm onSubmit={handleSubmit} />
        ) : (
          <ScorecardFeedback scores={scores} onRetake={retakeQuiz} />
        )}
      </div>
    </div>
  );
};

export default Scorecard;