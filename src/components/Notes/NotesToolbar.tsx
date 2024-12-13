import React from 'react';
import { Save, Trash2, Share2, Download } from 'lucide-react';
import { useNotesStore } from '../../store/useNotesStore';
import { useTranslation } from '../../hooks/useTranslation';

export const NotesToolbar: React.FC = () => {
  const { selectedNote, saveNote, deleteNote } = useNotesStore();
  const { t } = useTranslation();

  if (!selectedNote) return null;

  return (
    <div className="border-b dark:border-gray-800 bg-white dark:bg-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => saveNote(selectedNote.id)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>{t('notes.save')}</span>
        </button>
        <button
          onClick={() => deleteNote(selectedNote.id)}
          className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          <span>{t('notes.delete')}</span>
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};