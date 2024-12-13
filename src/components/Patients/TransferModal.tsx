import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MoveRight } from 'lucide-react';
import { usePatientStore } from '../../store/usePatientStore';
import type { Patient } from '../../types/patient';

interface TransferModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  patient,
  isOpen,
  onClose
}) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const { transferPatient } = usePatientStore();

  const handleTransfer = async () => {
    if (!selectedLocation) return;
    
    try {
      await transferPatient(patient.id, selectedLocation);
      onClose();
    } catch (error) {
      console.error('Failed to transfer patient:', error);
    }
  };

  // Room configurations
  const rooms = {
    'ICU': ['1', '2a', '2b', '3', '4', '5', '6', '7'],
    'Rooms': {
      '901': 3,
      '902': 4,
      '903': 2,
      '904': 2,
      '905': 2,
      '906': 2,
      '907': 4,
      '908': 2,
      '909': 2,
      '910': 2,
      '911': 2,
      '912': 4,
      '913': 2
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-semibold">Transfer Patient</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Location</label>
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                  {patient.roomNumber}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select New Location</label>
                <div className="space-y-4">
                  {/* ICU Section */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">ICU</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {rooms.ICU.map((number) => (
                        <button
                          key={number}
                          onClick={() => setSelectedLocation(`ICU-${number}`)}
                          className={`p-2 text-sm rounded-lg border transition-colors ${
                            selectedLocation === `ICU-${number}`
                              ? 'bg-primary text-white border-primary'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rooms Section */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Rooms</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(rooms.Rooms).map(([room, beds]) => (
                        Array.from({ length: beds }, (_, i) => {
                          const location = `${room}-${i + 1}`;
                          return (
                            <button
                              key={location}
                              onClick={() => setSelectedLocation(location)}
                              className={`p-2 text-sm rounded-lg border transition-colors ${
                                selectedLocation === location
                                  ? 'bg-primary text-white border-primary'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                              }`}
                            >
                              {location}
                            </button>
                          );
                        })
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 p-4 border-t dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={!selectedLocation}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MoveRight className="w-5 h-5" />
                Transfer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};