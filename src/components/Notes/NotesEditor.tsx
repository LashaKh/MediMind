import React from 'react';
import { motion } from 'framer-motion';
import { useNotesStore } from '../../store/useNotesStore';
import { VoiceInput } from './VoiceInput';

export const NotesEditor: React.FC = () => {
  const { selectedNote, updateNote } = useNotesStore();

  if (!selectedNote) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote(selectedNote.id, { title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(selectedNote.id, { content: e.target.value });
  };

  const handleVoiceTranscript = (transcript: string) => {
    updateNote(selectedNote.id, { 
      content: selectedNote.content 
        ? `${selectedNote.content}\n${transcript}`
        : transcript 
    });
  };

  return (
    <motion.div 
      className="flex-1 p-6 bg-white dark:bg-gray-800 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          value={selectedNote.title}
          onChange={handleTitleChange}
          className="flex-1 text-3xl font-bold bg-transparent border-none outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Note title..."
        />
        <VoiceInput onTranscript={handleVoiceTranscript} />
      </div>

      <textarea
        value={selectedNote.content}
        onChange={handleContentChange}
        className="w-full h-[calc(100vh-16rem)] resize-none bg-transparent border-none outline-none focus:ring-0 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
        placeholder="Start writing your note..."
      />
    </motion.div>
  );
};