import React, { useState, useContext } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { DarkModeContext } from "../../context/Theme"; // Adjust path as needed

const BasicFAQ = () => {
  const { isDark } = useContext(DarkModeContext); // Dark mode context

  return (
    <div className={`px-6 py-16 ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="mx-auto max-w-3xl">
        <h3
          className={`mb-8 text-center text-3xl md:text-4xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Frequently Asked Questions
        </h3>
        <Question
          title="What is 4D Leader?"
          defaultOpen
          isDark={isDark}
        >
          <p>
            4D Leader is an AI-powered, on-demand executive coach designed to
            support leaders in making better decisions, optimising resilience,
            and leading effectively without burnout. Integrated into WhatsApp
            and Slack, it delivers personalised coaching based on the 4D Model:
            Cognitive, Physical, Emotional, and Spiritual Intelligence.
          </p>
        </Question>
        <Question
          title="How does the 4D Model work?"
          isDark={isDark}
        >
          <p>
            The 4D Model guides you through four dimensions of leadership:
            Cognitive Intelligence for strategic thinking, Physical
            Intelligence for resilience and energy, Emotional Intelligence for
            relationship management, and Spiritual Intelligence for
            purpose-driven leadership. The AI tailors coaching to enhance each
            area based on your needs.
          </p>
        </Question>
        <Question
          title="What’s included in the pricing plans?"
          isDark={isDark}
        >
          <p>
            The Basic Plan (£29/month) offers foundational AI coaching and core
            4D Model guidance. The Pro Plan (£79/month) adds real-time WhatsApp
            coaching, advanced analytics, and enhanced resilience tools. The
            Enterprise Plan (£199/month) includes unlimited users, custom
            branding, human coaching, and exclusive workshops for
            organisations.
          </p>
        </Question>
        <Question
          title="Can I try 4D Leader before subscribing?"
          isDark={isDark}
        >
          <p>
            Yes! We’re offering exclusive early access for beta users. Sign up
            via our website to join the waitlist and experience 4D Leader’s
            features firsthand. You’ll also get a free 4D Leadership
            Intelligence Scorecard to assess your strengths.
          </p>
        </Question>
        <Question
          title="How does the AI personalise coaching?"
          isDark={isDark}
        >
          <p>
            The AI tracks your interactions, preferences, and progress using a
            memory engine, adapting its responses to your unique leadership
            challenges. It also offers customised pathways and ongoing
            assessments like the 4D Scorecard to target areas for improvement.
          </p>
        </Question>
      </div>
    </div>
  );
};

const Question = ({ title, children, defaultOpen = false, isDark }) => {
  const [ref, { height }] = useMeasure();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      animate={open ? "open" : "closed"}
      className={`border-b-[1px] ${
        isDark ? "border-gray-700" : "border-gray-300"
      }`}
    >
      <button
        onClick={() => setOpen((pv) => !pv)}
        className="flex w-full items-center justify-between gap-4 py-6"
      >
        <motion.span
          variants={{
            open: {
              color: isDark ? "rgba(255, 255, 255, 0)" : "rgba(3, 6, 23, 0)",
            },
            closed: {
              color: isDark ? "rgba(255, 255, 255, 1)" : "rgba(3, 6, 23, 1)",
            },
          }}
          className={`bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-left text-lg font-semibold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </motion.span>
        <motion.span
          variants={{
            open: {
              rotate: "180deg",
              color: "rgb(79, 70, 229)", // Indigo-600
            },
            closed: {
              rotate: "0deg",
              color: isDark ? "#ffffff" : "#030617",
            },
          }}
        >
          <FiChevronDown className="text-2xl" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? height : "0px",
          marginBottom: open ? "24px" : "0px",
        }}
        className="overflow-hidden"
      >
        <p
          ref={ref}
          className={isDark ? "text-gray-300" : "text-gray-600"}
        >
          {children}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default BasicFAQ;