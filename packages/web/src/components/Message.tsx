import React, { useCallback } from 'react';

export interface MessageState {
  type: 'error' | null;
  content: string;
}

interface MessageProps {
  message: MessageState;
}

export default function Message({ message }: MessageProps) {
  const getColorClassName = useCallback(() => {
    switch (message.type) {
      case 'error':
        return 'bg-red-100 text-red-600';
      default:
        return '';
    }
  }, [message.type]);

  const getIconClassName = useCallback(() => {
    switch (message.type) {
      case 'error':
        return 'fa-solid fa-xmark';
      default:
        return '';
    }
  }, [message.type]);

  if (message.type === null) return null;

  return (
    <div
      className={`flex items-center gap-4 px-5 py-3 rounded-lg ${getColorClassName()}`}
    >
      <i className={getIconClassName()} />
      <p>{message.content}</p>
    </div>
  );
}
