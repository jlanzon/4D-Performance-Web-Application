import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { scorecardData } from './scorecardData';
import { DarkModeContext } from '../../context/Theme';
import { FiArrowRight } from 'react-icons/fi';
import WaitingListModal from '../../components/WaitingListModal';
import ScorecardBarChart from './ScorecardBarChart';
import ScorecardAnalytics from './ScorecardAnalytics';
import { printReport } from '../../utils/printReport';
import PrintableScoreCard from './PrintableScoreCard';


const ScorecardFeedback = ({ scores, onRetake }) => {
  const { isDark } = useContext(DarkModeContext);
  const [expanded, setExpanded] = useState(
    Object.keys(scores).reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {})
  );

  const isComplex = Object.values(scores).every(
    (val) => typeof val === 'object' && 'score' in val
  );

  const printClicked = () => {
    printReport('#printable-scorecard-root', '4D-Leadership-Score.pdf');
    toggleHiddenPDF(true);
  };

  const averageScore = isComplex
    ? (
        Object.values(scores).reduce((sum, data) => sum + parseFloat(data.score), 0) /
        Object.keys(scores).length
      ).toFixed(1)
    : (
        Object.values(scores).reduce((sum, score) => sum + parseFloat(score), 0) /
        Object.keys(scores).length
      ).toFixed(1);

  // Benchmark data (simulated for now)
  const benchmarkScores = {
    cognitive: 7.5,
    physical: 6.8,
    emotional: 7.2,
    spiritual: 6.5,
  };

  const categories = Object.keys(scores);

  return (
   <div
  id="scorecard-print-root"
  className={`p-8 rounded-2xl shadow-xl ${
    isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
  }`}
>
 <div
  style={{
    position: 'fixed',
    left: '-10000px',
    top: 0,
    width: '794px',         // A4 width at 96 DPI
    background: '#fff',
    padding: 0,
    margin: 0,
    zIndex: -1,
    visibility: 'hidden',   // keep it invisible; layout still happens
  }}
  aria-hidden="true"
>
  <PrintableScoreCard scores={scores} animate={false} />
</div>


      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent text-center md:leading-tight lg:leading-tight"
        style={{
          letterSpacing: '0.01em',
          lineHeight: '1.1',
          marginBottom: '2rem',
        }}
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
        {Object.entries(scores).map(([category, data]) => {
          const score = isComplex ? data.score : data;
          const totalQuestions = scorecardData[category].questions.length;
          const answeredCount = isComplex
            ? Object.keys(data.answers).length - Object.values(data.skipped).filter(Boolean).length
            : totalQuestions;
          return (
            <li key={category} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center justify-between">
                <strong
                  className={`capitalize text-xl font-semibold ${
                    isDark ? 'text-gray-200' : 'text-gray-800'
                  }`}
                >
                  {category} Intelligence: {score} / 10
                  {answeredCount < totalQuestions && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({answeredCount}/{totalQuestions} questions answered)
                    </span>
                  )}
                </strong>
                <button
                  onClick={() => setExpanded((prev) => ({ ...prev, [category]: !prev[category] }))}
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
                  <p className="mt-2">
                    Compared to benchmark: {score - benchmarkScores[category] >= 0 ? '+' : ''}
                    {(score - benchmarkScores[category]).toFixed(1)} (Benchmark: {benchmarkScores[category]})
                  </p>
                </motion.div>
              )}
            </li>
          );
        })}
      </ul>
      {isComplex && (
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <ScorecardBarChart scores={scores} isDark={isDark} />
          </div>
          <div className="flex-1">
            <ScorecardAnalytics scores={scores} isDark={isDark} benchmarkScores={benchmarkScores} />
          </div>
        </div>
      )}
      {isComplex && categories.length > 0 && (
        <div className="mt-12">
          <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            All Questions & Answers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category} className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 shadow-md flex flex-col">
                <h4 className={`text-lg font-medium capitalize mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {category} Intelligence
                </h4>
                <ul className="space-y-2">
                  {scorecardData[category].questions.map((question, index) => {
                    const key = `${category}${index + 1}`;
                    const answer = scores[category].answers[key];
                    const isSkipped = scores[category].skipped[key];
                    return (
                      <li key={index} className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className="font-medium">{question}</span>
                        <span className="ml-2">{isSkipped ? 'Skipped' : `Score: ${answer}/10`}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
  <motion.button
    onClick={onRetake}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`group flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-lg font-semibold ${
      isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
    }`}
  >
    Retake Quiz
    <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
  </motion.button>

   <motion.button
    onClick={() => printClicked()}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`group flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-lg font-semibold ${
      isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
    }`}
  >
    Download PDF
  </motion.button>

  <WaitingListModal />
</div>

    </div>
  );
};

export default ScorecardFeedback;