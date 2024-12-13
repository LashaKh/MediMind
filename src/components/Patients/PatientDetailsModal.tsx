import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FileText, Heart, Activity } from 'lucide-react';
import { NotesSection } from './PatientDetailsModal/NotesSection';
import { EchoSection } from './PatientDetailsModal/EchoSection';
import { ECGSection } from './PatientDetailsModal/ECGSection';
import { usePatientStore } from '../../store/usePatientStore';
import type { Patient } from '../../types/patient';

interface PatientDetailsModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patient,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'echo' | 'ecg'>('info');
  const [editedPatient, setEditedPatient] = useState(patient);
  const { updatePatient, addNote } = usePatientStore();

  const handleSave = async () => {
    try {
      await updatePatient(patient.id, editedPatient);
      onClose();
    } catch (error) {
      console.error('Failed to save patient:', error);
    }
  };

  const handleBasicInfoChange = (field: string, value: any) => {
    setEditedPatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEchoDataChange = (field: keyof Patient['echoData'], value: string) => {
    setEditedPatient(prev => ({
      ...prev,
      echoData: {
        ...prev.echoData,
        [field]: value
      }
    }));
  };

  const handleECGDataChange = (notes: string) => {
    setEditedPatient(prev => ({
      ...prev,
      ecgData: {
        ...prev.ecgData,
        notes
      }
    }));
  };

  const handleAddNote = async (content: string) => {
    await addNote(patient.id, { content, type: 'general' });
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
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2 className="text-2xl font-bold">Patient Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 p-4 border-b dark:border-gray-700">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'info' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Patient Information</span>
              </button>
              <button
                onClick={() => setActiveTab('echo')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'echo'
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span>Echo</span>
              </button>
              <button
                onClick={() => setActiveTab('ecg')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'ecg'
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>ECG</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 space-y-6"
                  >
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <input
                            type="text"
                            value={editedPatient.name}
                            onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Diagnosis</label>
                          <input
                            type="text"
                            value={editedPatient.diagnosis}
                            onChange={(e) => handleBasicInfoChange('diagnosis', e.target.value)}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <NotesSection 
                      notes={patient.notes}
                      onAddNote={handleAddNote}
                    />
                  </motion.div>
                )}

                {activeTab === 'echo' && (
                  <motion.div
                    key="echo"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6"
                  >
                    <EchoSection 
                      patient={editedPatient}
                      onEchoDataChange={handleEchoDataChange}
                    />
                  </motion.div>
                )}

                {activeTab === 'ecg' && (
                  <motion.div
                    key="ecg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6"
                  >
                    <ECGSection 
                      patient={editedPatient}
                      onECGDataChange={handleECGDataChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
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
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};