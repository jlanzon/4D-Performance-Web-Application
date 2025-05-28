import { FiCloudLightning } from "react-icons/fi";
import { motion } from "framer-motion";

const Testimonials = ({ testimonials }) => {
  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <ShimmerTestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
};

const ShimmerTestimonialCard = ({ testimonial }) => {
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-lg bg-slate-800 p-0.5 transition-all duration-500 hover:scale-[1.01] hover:bg-slate-800/50">
      <div className="relative z-10 justify-baseline h-full flex flex-col items-center  overflow-hidden rounded-[7px] bg-slate-900 p-8 transition-colors duration-500 group-hover:bg-slate-800">
        <FiCloudLightning className="relative z-10 mb-10 mt-2 rounded-full border-2 border-indigo-500 bg-slate-900 p-4 text-7xl text-indigo-500" />

        <blockquote className="relative z-10 mb-4 w-full text-xl italic text-slate-400">
          "{testimonial.quote}"
        </blockquote>
        <footer className="relative z-10 w-full">
          <p className="text-2xl font-bold text-slate-50">{testimonial.author}</p>
          <p className="text-slate-400 text-sm">{testimonial.role}</p>
        </footer>
      </div>

      <motion.div
        initial={{ rotate: "0deg" }}
        animate={{ rotate: "360deg" }}
        style={{ scale: 1.75 }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
        className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-200 via-indigo-200/0 to-indigo-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </div>
  );
};

export default Testimonials;