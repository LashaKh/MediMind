import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, MessageSquare, Clock, Database, Award } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Database,
      title: "Comprehensive Knowledge Base",
      description: "Access a vast database of peer-reviewed medical literature, clinical guidelines, and research papers"
    },
    {
      icon: Clock,
      title: "Instant Information Access",
      description: "Get evidence-based answers to clinical questions within seconds, saving valuable time"
    },
    {
      icon: Brain,
      title: "Advanced AI Analysis",
      description: "Utilize cutting-edge medical AI to analyze complex clinical scenarios and research"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security ensuring all interactions meet healthcare privacy standards"
    },
    {
      icon: Award,
      title: "Evidence-Based Results",
      description: "Receive information backed by the latest medical research and clinical guidelines"
    },
    {
      icon: MessageSquare,
      title: "Clinical Collaboration",
      description: "Discuss complex cases and share insights with peer-reviewed accuracy"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Empowering Medical Professionals
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Access the latest medical knowledge and research instantly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};