'use client';

import { motion } from 'framer-motion';
import { FaBrain, FaRobot, FaLightbulb } from 'react-icons/fa';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <FaBrain className="text-6xl text-primary" />
              <FaRobot className="absolute -top-2 -right-2 text-3xl text-secondary" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            CognitiveFrontier
            <span className="text-primary">.info</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            Exploring the frontier between human cognition and artificial
            intelligence
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FaBrain className="text-3xl text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Cognitive Science</h3>
              <p className="text-gray-600">
                Understanding how the human mind processes information and makes
                decisions
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FaRobot className="text-3xl text-secondary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">
                Artificial Intelligence
              </h3>
              <p className="text-gray-600">
                Exploring machine learning, neural networks, and AI
                consciousness
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FaLightbulb className="text-3xl text-warning mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Bridging the gap between human and artificial intelligence
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mt-16"
          >
            <p className="text-lg text-gray-500 mb-4">
              🚧 Site under construction 🚧
            </p>
            <p className="text-sm text-gray-400">
              We're building something amazing. Stay tuned!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
