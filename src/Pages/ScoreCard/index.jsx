import React, { useState, useContext, useEffect } from 'react';
import { motion, useMotionValue, animate, useMotionTemplate } from 'framer-motion';
import { Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import ScorecardForm from './ScorecardForm';
import ScorecardFeedback from './ScorecardFeedback';
import WaitingListModal from './WaitingListModal';
import { DarkModeContext } from '../../context/Theme';

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const Scene = React.memo(() => (
  <Stars radius={50} count={1500} factor={4} fade speed={1} />
));

const Scorecard = () => {
  const { isDark } = useContext(DarkModeContext);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState({});
  const [showModal, setShowModal] = useState(false);
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const baseColor = isDark ? "#020617" : "#020617";
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, ${baseColor} 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  const handleSubmit = (categoryData) => {
    setScores(categoryData);
    setSubmitted(true);
    setShowModal(true); // Show popup on submission
  };

  const retakeQuiz = () => {
    setSubmitted(false);
    setScores({});
    setShowModal(false);
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Header Section */}
      <motion.header
        style={{ backgroundImage }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative grid min-h-[60vh] place-content-center overflow-hidden px-6 py-16"
      >
        <div className="relative z-10 flex flex-col items-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-4xl font-extrabold leading-tight text-transparent sm:text-5xl md:text-6xl"
          >
            4D Leadership Intelligence Scorecard
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg text-gray-200"
          >
            Assess your leadership across four dimensions with our AI-powered tool.
          </motion.p>
        </div>
        <div className="absolute inset-0 z-0">
          <Canvas>
            <Scene />
          </Canvas>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative -mt-20 rounded-t-[3rem] pt-20 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-16">
          <div
            className={`w-full max-w-7xl mx-auto rounded-2xl shadow-xl p-8 ${
              isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}
          >
            {!submitted ? (
              <ScorecardForm onSubmit={handleSubmit} />
            ) : (
              <ScorecardFeedback scores={scores} onRetake={retakeQuiz} />
            )}
          </div>
        </div>
      </main>

      {/* Waiting List Modal */}
      {showModal && (
        <WaitingListModal onClose={() => setShowModal(false)} />
      )}

    

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">4D Leader</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Empowering leaders with cutting-edge AI-driven coaching solutions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} 4D Leader. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Scorecard;