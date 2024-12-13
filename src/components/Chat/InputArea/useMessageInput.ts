import { useState, useCallback, FormEvent } from 'react';

export const useMessageInput = (onSend: (message: string) => void) => {
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  }, [message, onSend]);

  return {
    message,
    setMessage,
    handleSubmit
  };
};