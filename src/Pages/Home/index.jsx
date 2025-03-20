import React, { Suspense } from "react";
import { motion } from "framer-motion";

export default function Home() {
  // Features array (unchanged)
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

  // Define array for "Powered by AI" section
  const aiFeatures = [
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

  // Define array for testimonials
  const testimonials = [
    {
      quote: "4D Leader transformed my leadership approach with personalised coaching and real-time insights.",
      author: "Joseph Lanzon, Lead Software Developer",
    },
    {
      quote: "My team’s performance soared, and the holistic approach keeps me resilient.",
      author: "Jane Smith, COO of ABC Inc",
    },
    {
      quote: "AI-driven insights are spot-on, helping me navigate tough decisions confidently.",
      author: "Alex Johnson, Founder of Startup Co",
    },
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        {/* Header */}
        <header>
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
                Your AI-powered executive coach for clarity, confidence, and resilience.
              </p>
              <div className="flex justify-center gap-4">
                <motion.a
                  href="/signup"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                  Get Started
                </motion.a>
                <motion.a
                  href="/scorecard"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-cyan-600 hover:text-white transition duration-300 border-opacity-50"
                >
                  Take the free Score Card
                </motion.a>
              </div>
              <motion.img
                src="./hero.jpg"
                alt="4D Leader"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-300 h-200 relative object-cover mx-auto my-10 rounded-4xl"
              />
            </div>
          </motion.header>
        </header>

        {/* Main Content */}
        <div className="rounded-t-4xl relative top-[-15rem] bg-gray-900 z-10">
          {/* Features Section */}
          <section className="container mx-auto px-4 py-16">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-8 text-gray-100"
            >
              Key Features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
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
          <section className="mx-auto px-4 py-16 bg-gray-100 text-gray-800 rounded-4xl">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-4"
            >
              Powered by AI
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-center mb-8"
            >
              Leveraging cutting-edge AI for personalised, real-time coaching.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {aiFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-lg shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <img
                    src={feature.image}
                    alt={feature.alt}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="container mx-auto px-4 mt-24 rounded-4xl py-16 bg-gray-100">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-8 text-gray-800"
            >
              What Our Users Say
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-6 rounded-lg shadow-lg"
                >
                  <p className="text-lg text-gray-600 italic">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-gray-800 font-semibold mt-4">
                    – {testimonial.author}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gray-800 text-white py-8"
        >
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
        </motion.footer>
      </div>
    </Suspense>
  );
}