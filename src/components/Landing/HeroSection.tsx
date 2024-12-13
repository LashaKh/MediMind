import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const HeroSection: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleTrialClick = () => {
    if (user) {
      navigate('/chat');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-32">
      <motion.div 
        className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="h-[40rem] w-[40rem] rounded-full bg-secondary/20 blur-3xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 bg-clip-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your Advanced Medical AI Assistant
          </motion.h1>
          <motion.p 
            className="mt-6 text-xl leading-8 text-gray-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Access comprehensive, evidence-based medical information within seconds. Designed specifically for medical professionals to enhance clinical decision-making.
          </motion.p>
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.button
              onClick={handleTrialClick}
              className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-primary shadow-lg hover:bg-gray-100 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Free Trial
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};