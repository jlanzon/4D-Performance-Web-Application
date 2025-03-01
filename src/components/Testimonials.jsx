import { motion } from 'framer-motion';

export default function Testimonials() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h2 className="text-4xl font-bold text-center mb-8 text-white">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-black italic">
            "4D Leader transformed my leadership approach with personalised coaching and real-time insights."
          </p>
          <p className="text-black font-semibold mt-4">– Joseph Lanzon, Lead Software Developer</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-black italic">
            "My team’s performance soared, and the holistic approach keeps me resilient."
          </p>
          <p className="text-black font-semibold mt-4">– Jane Smith, COO of ABC Inc</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-black italic">
            "AI-driven insights are spot-on, helping me navigate tough decisions confidently."
          </p>
          <p className="text-black font-semibold mt-4">– Alex Johnson, Founder of Startup Co</p>
        </div>
      </div>
    </motion.section>
  );
}