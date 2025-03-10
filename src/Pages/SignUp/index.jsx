import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const primaryVariants = {
  initial: { y: 25, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export const SlideInAuth = () => {
  return (
    <div className="flex max-h-screen overflow-hidden flex-col md:flex-row grid-cols-1 bg-gray-100 dark:bg-slate-900 md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px] ">
      <div className="w-screen md:w-[50vw] mt-16">
        <Form />
      </div>
      <div className="w-screen md:w-[50vw] mt-32">
        <SupplementalContent />
      </div>
    </div>
  );
};

const Form = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  const checkPasswordStrength = (pwd) => {
    const strongRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (strongRegex.test(pwd)) {
      setPasswordStrength("Strong");
    } else if (pwd.length >= 8) {
      setPasswordStrength("Moderate");
    } else {
      setPasswordStrength("Weak");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== retypePassword) {
      setError("Passwords do not match");
      return;
    }
    if (!termsChecked) {
      setError("You must agree to the terms");
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        firstName,
        lastName,
        email,
        role: "user",
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
      }}
      className="flex items-center justify-center py-20 max-h-[95vh]"
    >
      <div className="mx-auto max-w-lg px-4">
        <motion.h1
          variants={primaryVariants}
          className="mb-2 text-center text-4xl font-semibold text-gray-900 dark:text-white"
        >
          Create your account
        </motion.h1>
        {error && (
          <motion.p
            variants={primaryVariants}
            className="mb-4 text-center text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSignup} className="w-full">
          <motion.div variants={primaryVariants} className="mb-2 w-full">
            <label
              htmlFor="first-name-input"
              className="mb-1 inline-block text-sm font-medium text-gray-700 dark:text-white"
            >
              First Name<span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              id="first-name-input"
              type="text"
              placeholder="Enter your first name"
              className="w-full rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-gray-900 dark:text-white focus:outline-indigo-600"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </motion.div>

          <motion.div variants={primaryVariants} className="mb-2 w-full">
            <label
              htmlFor="last-name-input"
              className="mb-1 inline-block text-sm font-medium text-gray-700 dark:text-white"
            >
              Last Name<span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              id="last-name-input"
              type="text"
              placeholder="Enter your last name"
              className="w-full rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-gray-900 dark:text-white focus:outline-indigo-600"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </motion.div>

          <motion.div variants={primaryVariants} className="mb-2 w-full">
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

          <motion.div variants={primaryVariants} className="mb-2 w-full">
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
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
              required
            />
            {password && (
              <p
                className={`text-sm mt-1 ${
                  passwordStrength === "Strong"
                    ? "text-green-500 dark:text-green-400"
                    : passwordStrength === "Moderate"
                    ? "text-yellow-500 dark:text-yellow-400"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
          </motion.div>

          <motion.div variants={primaryVariants} className="mb-4 w-full">
            <label
              htmlFor="rt-password-input"
              className="mb-1 inline-block text-sm font-medium text-gray-700 dark:text-white"
            >
              Re-type Password<span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              id="rt-password-input"
              type="password"
              placeholder="Re-type your password"
              className="w-full rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-gray-900 dark:text-white focus:outline-indigo-600"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              required
            />
          </motion.div>

          <motion.div
            variants={primaryVariants}
            className="mb-4 flex w-full items-start gap-1.5"
          >
            <input
              type="checkbox"
              id="terms-checkbox"
              className="h-4 w-4 accent-indigo-600 dark:accent-indigo-400"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
              required
            />
            <label htmlFor="terms-checkbox" className="text-xs text-gray-700 dark:text-white">
              By signing up, I agree to the terms and conditions, privacy
              policy, and cookie policy
            </label>
          </motion.div>

          <motion.button
            variants={primaryVariants}
            whileTap={{ scale: 0.985 }}
            type="submit"
            className="mb-1.5 w-full rounded bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700 dark:hover:bg-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </motion.button>
          <motion.p
            variants={primaryVariants}
            className="text-xs text-center text-gray-600 dark:text-gray-300"
          >
            Already have an account?{" "}
            <a className="text-indigo-600 dark:text-indigo-400 underline" href="/login">
              Sign in
            </a>
          </motion.p>
        </form>
      </div>
    </motion.div>
  );
};

const SupplementalContent = () => {
  return (
    <div className="group sticky top-4 m-4 h-80 overflow-hidden rounded-3xl rounded-tl-[4rem] bg-gray-200 dark:bg-slate-950 md:h-[calc(80vh_-_2rem)]">
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
        animate="animate"
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
        className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-gray-900/90 dark:from-slate-950/90 to-gray-900/0 dark:to-slate-950/0 p-8"
      >
        <motion.h2
          variants={primaryVariants}
          className="mb-2 text-3xl font-semibold leading-[1.25] text-white dark:text-white lg:text-4xl"
        >
          Empowering Leaders<br />to Achieve Peak Performance
        </motion.h2>
        <motion.p
          variants={primaryVariants}
          className="mb-6 max-w-md text-sm text-gray-200 dark:text-gray-300"
        >
          4D Leader is your on-demand AI executive coach, offering personalised
          insights and strategies to boost decision-making, resilience, and
          holistic leadership.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SlideInAuth;