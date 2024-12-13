import React, { useState } from 'react';
import { format } from 'date-fns';
import { VoiceRecorder } from '../../common/VoiceRecorder';
import type { PatientNote } from '../../../types/patient';

interface NotesSectionProps {
  notes: PatientNote[];
  onAddNote: (content: string) => Promise<void>;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ notes, onAddNote }) => {
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await onAddNote(newNote);
      setNewNote('');
      setError(null);
    } catch (error) {
      setError('Failed to add note');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Notes</h3>
      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">
                {format(note.timestamp, 'MMM d, yyyy HH:mm')}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{note.content}</p>
          </div>
        ))}
        
        <div className="space-y-2">
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
              className="flex-1 p-2 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
            <VoiceRecorder
              onTranscript={(text) => setNewNote(prev => prev + ' ' + text)}
              onError={setError}
              language="ka-GE"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};