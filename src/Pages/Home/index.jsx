import React, { Suspense } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      title: "Personalised Coaching",
      description:
        "Tailored leadership guidance to navigate challenges and optimise performance.",
      image: "./hr1.jpg",
    },
    {
      title: "Real-Time Insights",
      description:
        "Instant access to AI-driven insights for confident decision-making under pressure.",
      image: "./hr1.jpg",
    },
    {
      title: "Holistic Development",
      description:
        "Grow across Cognitive, Physical, Emotional, and Spiritual dimensions.",
      image: "./hr1.jpg",
    },
    {
      title: "Burnout Prevention",
      description:
        "Stay resilient with strategic insights and personalised recommendations.",
      image: "./hr1.jpg",
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        {/* Header */}
        <header>
          {/* Navbar */}

          {/* Hero Section */}
          <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-200 to-cyan-200 text-white py-32"
          >
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-6xl md:text-7xl font-bold mb-8">
                Empower Your Leadership with AI
              </h1>
              <p className="text-xl md:text-2xl mb-12">
                Your AI-powered executive coach for clarity, confidence, and
                resilience.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="/signup"
                  className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                  Get Started
                </a>
                <a
                  href="/scorecard"
                  className="border border-white text-white   font-semibold py-3 px-6 rounded-lg hover:bg-cyan-600 hover:text-white transition duration-300 border-opacity-50"
                >
                  Take the free Score Card
                </a>
              </div>
              <img
                src={"./hero.jpg"}
                alt="4D Leader"
                className="w-300 h-200 relative  object-cover mx-auto my-10 rounded-4xl"
              />
            </div>
          </motion.header>
        </header>

        {/* Main Content */}
        <div className="rounded-t-4xl relative  top-[-15rem] bg-gray-900 z-10">
          {/* Features Section */}
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-4xl shadow-lg text-center transition transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Powered by AI Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto px-4 py-16 bg-gray-100 text-gray-800 rounded-4xl"
          >
            <h2 className="text-3xl font-bold text-center mb-4">
              Powered by AI
            </h2>
            <p className="text-xl text-center mb-8">
              Leveraging cutting-edge AI for personalised, real-time coaching.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl">
                <img
                  src={"./hr1.jpg"}
                  alt="AI Tailored Guidance"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <p>
                  Analyses your behavior and feedback for tailored guidance.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl">
                <img
                  src={"./hr2.jpg"}
                  alt="AI Decision-Making"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <p>
                  Advanced machine learning aids decision-making under pressure.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl">
                <img
                  src={"./hr3.jpg"}
                  alt="AI Continuous Learning"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <p>Evolves with your needs through continuous learning.</p>
              </div>
            </div>
          </motion.section>

          {/* Testimonials Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 mt-24 rounded-4xl py-16 bg-gray-100"
          >
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                <p className="text-lg text-gray-600 italic">
                  "4D Leader transformed my leadership approach with
                  personalised coaching and real-time insights."
                </p>
                <p className="text-gray-800 font-semibold mt-4">
                  – Joseph Lanzon, Lead Software Developer
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                <p className="text-lg text-gray-600 italic">
                  "My team’s performance soared, and the holistic approach keeps
                  me resilient."
                </p>
                <p className="text-gray-800 font-semibold mt-4">
                  – Jane Smith, COO of ABC Inc
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                <p className="text-lg text-gray-600 italic">
                  "AI-driven insights are spot-on, helping me navigate tough
                  decisions confidently."
                </p>
                <p className="text-gray-800 font-semibold mt-4">
                  – Alex Johnson, Founder of Startup Co
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">4D Leader</h3>
                <p>Empowering leaders with AI-driven coaching.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Product</h3>
                <ul>
                  <li>
                    <a href="#" className="hover:text-gray-300">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-300">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-300">
                      Resources
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Company</h3>
                <ul>
                  <li>
                    <a href="#" className="hover:text-gray-300">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-300">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-300">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-gray-300">
                    Twitter
                  </a>
                  <a href="#" className="hover:text-gray-300">
                    LinkedIn
                  </a>
                  <a href="#" className="hover:text-gray-300">
                    Facebook
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p>© 2023 4D Leader. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Suspense>
  );
}
