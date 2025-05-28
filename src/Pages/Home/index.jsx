import React, { Suspense, useContext, useEffect } from "react";
import { motion, useMotionValue, animate, useMotionTemplate } from "framer-motion";
import { Cloud, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FiArrowRight } from "react-icons/fi";
import { DarkModeContext } from "../../context/Theme";
import { NeuPricing } from "./pricing";
import BasicFAQ from "./FAQ";
import Example from "../../components/ShimmerBorder";
import Testimonials from "../../components/ShimmerBorder";
import WaitingListModal from "../../components/WaitingListModal";

const FEATURES = [
  {
    title: "Personalised Coaching",
    description: "Tailored leadership guidance to navigate challenges and optimise performance.",
    image: "./hr1.jpg",
    alt: "Personalised coaching illustration",
  },
  {
    title: "Real-Time Insights",
    description: "Instant access to AI-driven insights for confident decision-making under pressure.",
    image: "./hr2.jpg",
    alt: "Real-time insights dashboard",
  },
  {
    title: "Holistic Development",
    description: "Grow across Cognitive, Physical, Emotional, and Spiritual dimensions.",
    image: "./hr3.jpg",
    alt: "Holistic development diagram",
  },
  {
    title: "Burnout Prevention",
    description: "Stay resilient with strategic insights and personalised recommendations.",
    image: "./hr2.jpg",
    alt: "Burnout prevention strategies",
  },
];

const AI_FEATURES = [
  {
    description: "Analyses your behavior and feedback for tailored guidance.",
    image: "./hr1.jpg",
    alt: "AI Tailored Guidance",
  },
  {
    description: "Advanced machine learning aids decision-making under pressure.",
    image: "./hr2.jpg",
    alt: "AI Decision-Making",
  },
  {
    description: "Evolves with your needs through continuous learning.",
    image: "./hr3.jpg",
    alt: "AI Continuous Learning",
  },
];

const TESTIMONIALS = [
  {
    quote: "4D Leader transformed my leadership approach with personalised coaching and real-time insights.",
    author: "Joseph Lanzon",
    role: "Lead Software Engineer",
  },
  {
    quote: "My team’s performance soared, and the holistic approach keeps me resilient.",
    author: "Jane Smith",
    role: "COO of ABC Inc",
  },
  {
    quote: "AI-driven insights are spot-on, helping me navigate tough decisions confidently.",
    author: "Alex Johnson",
    role: "Founder of Startup Co",
  },
];

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const Scene = React.memo(() => (
  <>
    <Stars radius={50} count={2500} factor={4} fade speed={1} />
  </>
));

export default function Home() {
  const { isDark } = useContext(DarkModeContext);
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

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <div className="min-h-screen font-sans">
        {/* Hero Section */}
        <motion.header
          style={{ backgroundImage }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative grid min-h-screen place-content-center overflow-hidden px-6 py-24"
        >
          <div className="relative z-10 flex flex-col items-center">
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-4 inline-block rounded-full bg-red-600/20 px-3 py-1.5 text-sm border border-red-600/20 text-gray-800 dark:text-gray-200"
            >
              Beta Coming Soon
            </motion.span>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-4xl font-extrabold leading-tight text-transparent sm:text-5xl md:text-7xl"
            >
              Empower Your Leadership with AI
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg text-gray-200"
            >
              Your AI-powered executive coach for clarity, confidence, and resilience.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              
                
                <WaitingListModal disableButton={true} border={border} boxShadow={boxShadow} />
                
                

              
              <motion.a
                href="/scorecard"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                style={{ border, boxShadow }}

                className="group flex items-center gap-2 rounded-full bg-gray-950/10 px-6 py-3 text-gray-50 transition-colors hover:bg-gray-950/20 dark:hover:bg-gray-950/50"
              >
<div className="mx-auto">Take the 4D Leadership Test </div>               <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />

              </motion.a>
            </motion.div>
          </div>
          <div className="absolute inset-0 z-0">
            <Canvas>
              <Scene />
            </Canvas>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="relative -mt-20 rounded-t-[3rem] pt-20 bg-gray-100 dark:bg-gray-900">
          {/* Features Section */}
          {/* <div className="container mx-auto px-6 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow z-10"
                >
                  <img
                    src={feature.image}
                    alt={feature.alt}
                    
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div> */}

          {/* Testimonials Section */}
          <div className="container mx-auto px-6 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">What Our Users Say</h2>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> */}
            <Testimonials testimonials={TESTIMONIALS} />
            {/* </div> */}
            
          </div>
        </main>

        <div className="">
          <span className="absolute top-[100vh] left-[70%] z-0 h-[100] lg:h-[500px] w-[100px] lg:w-[600px] border -translate-x-[50%] rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-3xl" />
          <span className="absolute top-[150vh] left-[20%] z-0 h-[100] lg:h-[500px] w-[100px] lg:w-[600px] -translate-x-[50%] rounded-full bg-gradient-to-r from-red-600/20 to-green-600/20 blur-3xl" />
          <span className="absolute top-[200vh] left-[50%] z-0 h-[100] lg:h-[500px] w-[100px] lg:w-[600px] -translate-x-[50%] rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-3xl" />
          <span className="absolute top-[230vh] left-[70%] z-0 h-[100] lg:h-[500px] w-[100px] lg:w-[600px] -translate-x-[50%] rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-3xl" />
          <span className="absolute top-[280vh] left-[10%] z-0 h-[100] lg:h-[500px] w-[100px] lg:w-[600px] -translate-x-[50%] rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-3xl" />
        </div>

        <div>
          <NeuPricing />
        </div>

        <BasicFAQ />

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
                <ul className="space-y_PT_3 text-sm">
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
    </Suspense>
  );
}