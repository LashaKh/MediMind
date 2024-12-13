import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, BedDouble, MoveRight, Plus } from 'lucide-react';
import { usePatientStore } from '../../store/usePatientStore';
import { PatientDetailsModal } from './PatientDetailsModal';
import { TransferModal } from './TransferModal';
import { useTranslation } from '../../hooks/useTranslation';
import type { Patient } from '../../types/patient';

interface PatientCellProps {
  roomNumber: string;
  patient?: Patient;
  bedLabel: string;
  isBed?: boolean;
}

export const PatientCell: React.FC<PatientCellProps> = ({
  roomNumber,
  patient,
  bedLabel,
  isBed
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [editedPatient, setEditedPatient] = useState({
    name: '',
    diagnosis: '',
    notes: [],
    status: 'active' as const,
    admissionDate: new Date()
  });

  const { addPatient, deletePatient } = usePatientStore();
  const { t } = useTranslation();

  const handleCellClick = () => {
    if (patient) {
      setIsDetailsOpen(true);
    } else if (isBed) {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!patient) {
      await addPatient({
        ...editedPatient,
        roomNumber
      });
    }
    setIsEditing(false);
  };

  return (
    <>
      <motion.div 
        className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md ${
          isBed ? 'border border-gray-200 dark:border-gray-700' : ''
        } ${patient || isBed ? 'cursor-pointer' : ''}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onClick={handleCellClick}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {isBed && <BedDouble className="w-4 h-4 text-gray-400" />}
            {bedLabel}
          </h3>
          {patient ? (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTransferOpen(true);
                }}
                className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              >
                <MoveRight className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePatient(patient.id);
                }}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : isBed ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1 text-primary hover:bg-primary/10 rounded"
            >
              <Plus className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {isEditing ? (
          <div className="space-y-2" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              value={editedPatient.name}
              onChange={e => setEditedPatient({ ...editedPatient, name: e.target.value })}
              placeholder={t('patients.basicInfo.name')}
              className="w-full p-2 text-sm border rounded"
            />
            <input
              type="text"
              value={editedPatient.diagnosis}
              onChange={e => setEditedPatient({ ...editedPatient, diagnosis: e.target.value })}
              placeholder={t('patients.basicInfo.diagnosis')}
              className="w-full p-2 text-sm border rounded"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        ) : (
          patient && (
            <div>
              <p className="font-medium">{patient.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{patient.diagnosis}</p>
            </div>
          )
        )}

        {!patient && !isEditing && isBed && (
          <div className="flex items-center justify-center h-12 text-gray-400">
            <span className="text-sm">{t('patients.rooms.clickToAdd')}</span>
          </div>
        )}
      </motion.div>

      {patient && (
        <>
          <PatientDetailsModal
            patient={patient}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
          />
          <TransferModal
            patient={patient}
            isOpen={isTransferOpen}
            onClose={() => setIsTransferOpen(false)}
          />
        </>
      )}
    </>
  );
};