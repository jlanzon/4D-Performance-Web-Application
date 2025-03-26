import React, { Suspense, useContext, useEffect } from "react";
import { motion, useMotionValue, animate, useMotionTemplate } from "framer-motion";
import { Cloud, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FiArrowRight } from "react-icons/fi";
import { DarkModeContext } from "../../context/Theme";
import { NeuPricing } from "./pricing";
import BasicFAQ from "./FAQ";

const ThemeContext = React.createContext({
  isDark: true,
  toggleTheme: () => {},
});

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
    role: "Lead Software Developer",
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

const MotionSection = ({ children, className }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.section>
);


const Scene = React.memo(() => (
  <>
    {/* <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} /> */}
    <Stars radius={50} count={2500} factor={4} fade speed={1} />
  </>
));

const COLORS = [
  "violet-600",
  "indigo-600",
  "red-600",
  "green-600",
  "blue-600",
  "yellow-600",
  "pink-600",
  "purple-600",
  "orange-600",
  "teal-600",
];

const getRandomGradient = () => {
  const fromColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const toColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  return `bg-gradient-to-r from-${fromColor}/20 to-${toColor}/20`;
};


export default function Home() {
  const { isDark } = useContext(DarkModeContext); // Access isDark from DarkModeContext
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
            className="relative grid min-h-screen place-content-center overflow-hidden px-6 py-24"
          >
            
            <div className="relative z-10 flex flex-col items-center">
              <span className="mb-4 inline-block rounded-full bg-red-600/20 px-3 py-1.5 text-sm border border-red-600/20 text-gray-800 dark:text-gray-200">
                Beta Coming Soon
              </span>
              
              <h1 className="max-w-3xl bg-gradient-to-br  from-white to-gray-400 bg-clip-text text-center text-4xl font-extrabold leading-tight text-transparent sm:text-5xl md:text-7xl">
                Empower Your Leadership with AI
              </h1>
              <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg  text-gray-200">
                Your AI-powered executive coach for clarity, confidence, and resilience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="/signup"
                  style={{ border, boxShadow }}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="group flex items-center gap-2 rounded-full bg-gray-950/10 px-6 py-3 text-gray-50 transition-colors hover:bg-gray-950/20 dark:hover:bg-gray-950/50"
                >
                  Get Started
                  <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
                </motion.a>
                <motion.a
                  href="/scorecard"
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="flex items-center gap-2 rounded-full border-2 border-gray-200 px-6 py-3 text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  Free Score Card
                </motion.a>
              </div>
            </div>
            <div className="absolute inset-0 z-0">
            <Canvas
  
>
  <Scene />
</Canvas>


            </div>
          </motion.header>
  
          {/* Main Content */}
          <main className="relative -mt-20 rounded-t-[3rem] pt-20 bg-gray-100 dark:bg-gray-900">
            {/* Features Section */}
            <div className="container mx-auto px-6 py-16">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                {FEATURES.map((feature) => (
                  <motion.div
                    key={feature.title}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow z-10"
                  >
                    <img
                      src={feature.image}
                      alt={feature.alt}
                      loading="lazy"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
  
            
  
            {/* Testimonials Section */}
            <div className="container mx-auto px-6 py-16">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">What Our Users Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 dark:bg-gray-200 p-6 z-10 rounded-xl shadow-md"
                  >
                    <blockquote className="text-gray-300 dark:text-gray-600 italic mb-4">"{testimonial.quote}"</blockquote>
                    <footer>
                      <p className="text-white dark:text-gray-900 font-semibold">{testimonial.author}</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">{testimonial.role}</p>
                    </footer>
                  </div>
                ))}
              </div>
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
      </Suspense>
    );
  }