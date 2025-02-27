import { motion } from 'framer-motion';


const features = [
  {
    title: 'Personalised Coaching',
    description: 'Tailored leadership guidance to navigate challenges and optimise performance.',
  },
  {
    title: 'Real-Time Insights',
    description: 'Instant access to AI-driven insights for confident decision-making under pressure.',
  },
  {
    title: 'Holistic Development',
    description: 'Grow across Cognitive, Physical, Emotional, and Spiritual dimensions for balanced leadership.',
  },
  {
    title: 'Burnout Prevention',
    description: 'Stay resilient and maintain well-being with strategic insights and personalised recommendations.',
  },
];

export default function Features(){
  return (
    <section className="container mx-auto px-4 py-12 flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-2 text-black">{feature.title}</h2>
            <p className="text-black">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
