import { motion } from 'framer-motion';

const features = [
  {
    title: 'Personalised Coaching',
    description: 'Tailored leadership guidance to navigate challenges and optimise performance.',
    icon: '/icons/icon-coaching.png', // Replace with your actual icon path
  },
  {
    title: 'Real-Time Insights',
    description: 'Instant access to AI-driven insights for confident decision-making under pressure.',
    icon: '/icons/icon-insights.png', // Replace with your actual icon path
  },
  {
    title: 'Holistic Development',
    description: 'Grow across Cognitive, Physical, Emotional, and Spiritual dimensions for balanced leadership.',
    icon: '/icons/icon-holistic.png', // Replace with your actual icon path
  },
  {
    title: 'Burnout Prevention',
    description: 'Stay resilient with strategic insights and personalised recommendations.',
    icon: '/icons/icon-burnout.png', // Replace with your actual icon path
  },
];

export default function Features() {
  return (
    <section className="container mx-auto px-4 py-12 flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg text-center"
          >
            {/* <img
              src={feature.icon}
              alt={`${feature.title} icon`}
              className="w-16 h-16 mx-auto mb-4"
            /> */}
            <h2 className="text-2xl font-bold mb-2 text-black">{feature.title}</h2>
            <p className="text-black">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}