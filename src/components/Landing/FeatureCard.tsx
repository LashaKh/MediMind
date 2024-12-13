import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    className="flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <motion.div 
      className="rounded-full bg-primary/10 p-4 mb-6"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Icon className="h-8 w-8 text-primary" />
    </motion.div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </motion.div>
);