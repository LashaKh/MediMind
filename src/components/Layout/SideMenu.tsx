import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, StickyNote, Users, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface SideMenuProps {
  isMobile: boolean;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isMobile }) => {
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const { t } = useTranslation();

  useEffect(() => {
    setIsExpanded(!isMobile);
  }, [isMobile]);

  const menuItems = [
    { icon: MessageSquare, label: t('sidebar.aiChatbot'), path: '/chat' },
    { icon: StickyNote, label: t('sidebar.notes'), path: '/notes' },
    { icon: Users, label: t('sidebar.patientTable'), path: '/patients' }
  ];

  if (isMobile && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-primary rounded-full shadow-lg"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <AnimatePresence>
      {(isExpanded || !isMobile) && (
        <motion.div
          initial={isMobile ? { x: -320 } : { width: 72 }}
          animate={isMobile ? { x: 0 } : { width: isExpanded ? 240 : 72 }}
          exit={isMobile ? { x: -320 } : undefined}
          className="relative bg-gray-900/40 backdrop-blur-md"
        >
          <div className="h-full flex flex-col">
            <div className="flex-1 py-6">
              <div className="space-y-2 px-3">
                {menuItems.map(({ icon: Icon, label, path }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => isMobile && setIsExpanded(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-white/10 text-white font-medium' 
                        : 'text-gray-400 hover:bg-white/5'
                      }
                      ${!isExpanded && !isMobile ? 'justify-center' : ''}
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence mode="wait">
                      {(isExpanded || isMobile) && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="truncate"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};