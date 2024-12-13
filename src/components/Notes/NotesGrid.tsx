import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useNotesStore } from '../../store/useNotesStore';

interface NotesGridProps {
  searchQuery: string;
}

export const NotesGrid: React.FC<NotesGridProps> = ({ searchQuery }) => {
  const { notes, selectedNoteId, selectNote } = useNotesStore();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {filteredNotes.map((note) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`p-4 rounded-lg border dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow ${
            selectedNoteId === note.id ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
          }`}
          onClick={() => selectNote(note.id)}
        >
          <h3 className="font-medium mb-2 truncate">{note.title || 'Untitled Note'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-3">{note.content}</p>
          <p className="text-xs text-gray-400">
            {format(note.updatedAt, 'MMM d, yyyy HH:mm')}
          </p>
        </motion.div>
      ))}
    </div>
  );
};