import { motion } from 'framer-motion';
import WaitingListModal from './WaitingListModal';

export default function CallToAction() {
  return (
    <div className="bg-stone-50 dark:bg-stone-900">
      <div className="mx-auto w-full py-12 sm:px-6 sm:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative isolate overflow-hidden bg-stone-800 dark:bg-stone-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:px-24 lg:pt-0"
        >
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#gradient)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#818CF8" /> {/* indigo-400 */}
                <stop offset={1} stopColor="#C7D2FE" /> {/* indigo-200 */}
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center py-16 lg:py-32">
            <h2 className="text-3xl font-semibold tracking-tight text-balance text-stone-50 dark:text-stone-100 sm:text-4xl">
              Unlock Your Leadership Potential with AI
            </h2>
            <p className="mt-6 text-lg/8 text-pretty text-stone-300 dark:text-stone-400">
              Get instant, personalized coaching to enhance your decision-making, resilience, and performance. Join the waitlist for early access to 4D Leader.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
            <WaitingListModal />

              <a
                href="#"
                className="text-sm/6 font-semibold text-indigo-300 dark:text-indigo-400"
              >
                Learn More <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}