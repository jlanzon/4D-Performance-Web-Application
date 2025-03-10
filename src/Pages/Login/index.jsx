import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowUpRight, FiStar } from 'react-icons/fi';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const primaryVariants = {
  initial: { y: 25, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const SlideInLogin = () => {
  return (
    <div className="flex h-screen overflow-hidden flex-col md:flex-row grid-cols-1 bg-gray-100 dark:bg-slate-900 md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px]">
      <div className="w-screen md:w-[50vw] mt-16">
        <LoginForm />
      </div>
      <div className="w-screen md:w-[50vw] mt-32">
        <SupplementalContent />
      </div>
    </div>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      transition={{ staggerChildren: 0.05 }}
      viewport={{ once: true }}
      className="flex items-center justify-center py-10 h-full"
    >
      <div className="mx-auto max-w-lg px-4">
        <motion.h1
          variants={primaryVariants}
          className="mb-4 text-center text-4xl font-semibold text-gray-900 dark:text-white"
        >
          Login
        </motion.h1>

        {error && (
          <motion.p
            variants={primaryVariants}
            className="mb-4 text-center text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleLogin} className="w-full">
          <motion.div variants={primaryVariants} className="mb-4 w-full">
            <label
              htmlFor="email-input"
              className="mb-1 inline-block text-sm font-medium text-gray-700 dark:text-white"
            >
              Email<span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-gray-900 dark:text-white focus:outline-indigo-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>

          <motion.div variants={primaryVariants} className="mb-4 w-full">
            <label
              htmlFor="password-input"
              className="mb-1 inline-block text-sm font-medium text-gray-700 dark:text-white"
            >
              Password<span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              id="password-input"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-gray-900 dark:text-white focus:outline-indigo-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>

          <motion.button
            variants={primaryVariants}
            whileTap={{ scale: 0.985 }}
            type="submit"
            className="mb-4 w-full rounded bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700 dark:hover:bg-indigo-500"
          >
            Login
          </motion.button>

          <motion.p
            variants={primaryVariants}
            className="text-xs text-center text-gray-600 dark:text-gray-300"
          >
            Don't have an account?{' '}
            <a className="text-indigo-600 dark:text-indigo-400 underline" href="/signup">
              Sign up
            </a>
          </motion.p>
        </form>
      </div>
    </motion.div>
  );
};

const SupplementalContent = () => {
  return (
    <div className="group sticky top-4 m-4 h-60 overflow-hidden rounded-3xl rounded-tl-[4rem] bg-gray-200 dark:bg-slate-950 md:h-[calc(80vh_-_2rem)]">
      <img
        alt="Abstract leadership illustration"
        src="./AICoach.jpg" 
        className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-50"
        loading="lazy" 
      />
      <div className="absolute right-2 top-4 z-10">
        <FiArrowUpRight className="rotate-45 text-6xl text-indigo-500 dark:text-indigo-200 opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100" />
      </div>
      <motion.div
        initial="initial"
        whileInView="animate"
        transition={{ staggerChildren: 0.05 }}
        viewport={{ once: true }}
        className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-gray-900/90 dark:from-slate-950/90 to-gray-900/0 dark:to-slate-950/0 p-8"
      >
        <motion.h2
          variants={primaryVariants}
          className="mb-2 text-3xl font-semibold leading-[1.25] text-white dark:text-white lg:text-4xl"
        >
          Empowering Leaders<br />
          to Achieve Peak Performance
        </motion.h2>
        <motion.p
          variants={primaryVariants}
          className="mb-6 max-w-md text-sm text-gray-200 dark:text-gray-300"
        >
          4D Leader is your on‑demand AI executive coach, offering personalised insights and strategies to boost decision-making, resilience, and holistic leadership.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SlideInLogin;