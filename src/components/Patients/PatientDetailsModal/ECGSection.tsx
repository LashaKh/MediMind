import React from 'react';
import { VoiceRecorder } from '../../common/VoiceRecorder';
import type { Patient } from '../../../types/patient';

interface ECGSectionProps {
  patient: Patient;
  onECGDataChange: (notes: string) => void;
}

export const ECGSection: React.FC<ECGSectionProps> = ({ patient, onECGDataChange }) => {
  const handleVoiceTranscript = (text: string) => {
    onECGDataChange((patient.ecgData?.notes || '') + ' ' + text);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">ECG Notes</h3>
          <VoiceRecorder
            onTranscript={handleVoiceTranscript}
            onError={console.error}
            language="ka-GE"
          />
        </div>
        <textarea
          value={patient.ecgData?.notes || ''}
          onChange={(e) => onECGDataChange(e.target.value)}
          className="w-full h-64 p-4 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600"
          placeholder="Enter ECG notes..."
        />
      </div>
    </div>
  );
};