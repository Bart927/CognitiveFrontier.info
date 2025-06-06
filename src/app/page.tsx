'use client';

import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <main>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              width: '100vw',
            }}
          >
            <p className="text-lg text-gray-500 mb-4">
              🚧 Site under construction 🚧
            </p>
            <p>We&apos;re building something amazing. Stay tuned!</p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
