import React from 'react';
import { VoiceRecorder } from '../../common/VoiceRecorder';
import type { Patient } from '../../../types/patient';

interface EchoSectionProps {
  patient: Patient;
  onEchoDataChange: (field: keyof Patient['echoData'], value: string) => void;
}

export const EchoSection: React.FC<EchoSectionProps> = ({ patient, onEchoDataChange }) => {
  const handleVoiceTranscript = (text: string) => {
    onEchoDataChange('notes', (patient.echoData?.notes || '') + ' ' + text);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">IVS (cm)</label>
          <input
            type="text"
            value={patient.echoData?.ivs || ''}
            onChange={(e) => onEchoDataChange('ivs', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">LVEDD (cm)</label>
          <input
            type="text"
            value={patient.echoData?.lvedd || ''}
            onChange={(e) => onEchoDataChange('lvedd', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">EF (%)</label>
          <input
            type="text"
            value={patient.echoData?.ef || ''}
            onChange={(e) => onEchoDataChange('ef', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">LA (cm)</label>
          <input
            type="text"
            value={patient.echoData?.la || ''}
            onChange={(e) => onEchoDataChange('la', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ao. asc. (cm)</label>
          <input
            type="text"
            value={patient.echoData?.aoAsc || ''}
            onChange={(e) => onEchoDataChange('aoAsc', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ao. arch. (cm)</label>
          <input
            type="text"
            value={patient.echoData?.aoArch || ''}
            onChange={(e) => onEchoDataChange('aoArch', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ao. ab. (cm)</label>
          <input
            type="text"
            value={patient.echoData?.aoAb || ''}
            onChange={(e) => onEchoDataChange('aoAb', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">RV (cm)</label>
          <input
            type="text"
            value={patient.echoData?.rv || ''}
            onChange={(e) => onEchoDataChange('rv', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">TR (/4+)</label>
          <input
            type="text"
            value={patient.echoData?.tr || ''}
            onChange={(e) => onEchoDataChange('tr', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">MR (/4+)</label>
          <input
            type="text"
            value={patient.echoData?.mr || ''}
            onChange={(e) => onEchoDataChange('mr', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">IVC (% collapsed)</label>
          <input
            type="text"
            value={patient.echoData?.ivcCollapsed || ''}
            onChange={(e) => onEchoDataChange('ivcCollapsed', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">IVC (cm)</label>
          <input
            type="text"
            value={patient.echoData?.ivcCm || ''}
            onChange={(e) => onEchoDataChange('ivcCm', e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Additional Notes</h3>
          <VoiceRecorder
            onTranscript={handleVoiceTranscript}
            onError={console.error}
            language="ka-GE"
          />
        </div>
        <textarea
          value={patient.echoData?.notes || ''}
          onChange={(e) => onEchoDataChange('notes', e.target.value)}
          className="w-full h-32 p-4 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600"
          placeholder="Enter additional echo notes..."
        />
      </div>
    </div>
  );
};