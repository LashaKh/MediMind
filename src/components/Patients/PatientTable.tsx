import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { usePatientStore } from '../../store/usePatientStore';
import { PatientCell } from './PatientCell';
import { CollapsibleRoom } from './CollapsibleRoom';
import { useTranslation } from '../../hooks/useTranslation';

export const PatientTable: React.FC = () => {
  const { patients, loadPatients, cleanup } = usePatientStore();
  const [expandedRooms, setExpandedRooms] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    loadPatients();
    return () => cleanup();
  }, []);

  const toggleRoom = (roomNumber: string) => {
    setExpandedRooms(prev =>
      prev.includes(roomNumber)
        ? prev.filter(r => r !== roomNumber)
        : [...prev, roomNumber]
    );
  };

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

  const getPatientByLocation = (location: string) =>
    patients.find(p => p.roomNumber === location);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">{t('patients.title')}</h1>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline">{t('patients.addPatient')}</span>
          </button>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* ICU Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-base md:text-lg font-semibold">ICU</h2>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {rooms.ICU.map((number) => (
                <PatientCell
                  key={`ICU-${number}`}
                  roomNumber={`ICU-${number}`}
                  patient={getPatientByLocation(`ICU-${number}`)}
                  bedLabel={t('patients.rooms.bed', { number })}
                  isBed
                />
              ))}
            </div>
          </div>

          {/* Rooms Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h2 className="text-base md:text-lg font-semibold">{t('patients.rooms.title')}</h2>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {Object.entries(rooms.Rooms).map(([roomNumber, bedCount]) => (
                <CollapsibleRoom
                  key={roomNumber}
                  roomNumber={roomNumber}
                  bedCount={bedCount}
                  isExpanded={expandedRooms.includes(roomNumber)}
                  onToggle={() => toggleRoom(roomNumber)}
                  patients={patients}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};