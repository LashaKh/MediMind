import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useNotesStore } from '../../store/useNotesStore';

interface NotesListProps {
  searchQuery: string;
}

export const NotesList: React.FC<NotesListProps> = ({ searchQuery }) => {
  const { notes, selectedNoteId, selectNote } = useNotesStore();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="divide-y dark:divide-gray-800">
      {filteredNotes.map((note) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
            selectedNoteId === note.id ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
          onClick={() => selectNote(note.id)}
        >
          <h3 className="font-medium mb-1 truncate">{note.title || 'Untitled Note'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{note.content}</p>
          <p className="text-xs text-gray-400">
            {format(note.updatedAt, 'MMM d, yyyy HH:mm')}
          </p>
        </motion.div>
      ))}
    </div>
  );
};