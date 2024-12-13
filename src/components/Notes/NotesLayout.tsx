import React, { useEffect } from 'react';
import { NotesSidebar } from './NotesSidebar';
import { NotesEditor } from './NotesEditor';
import { NotesToolbar } from './NotesToolbar';
import { useNotesStore } from '../../store/useNotesStore';

export const NotesLayout: React.FC = () => {
  const { selectedNoteId, loadNotes, cleanup } = useNotesStore();

  useEffect(() => {
    loadNotes();
    return () => cleanup();
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-50 dark:bg-gray-900">
      <NotesSidebar />
      <div className="flex-1 flex flex-col">
        <NotesToolbar />
        {selectedNoteId ? (
          <NotesEditor />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>Select a note or create a new one to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};