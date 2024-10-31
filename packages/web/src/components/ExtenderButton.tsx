import React from 'react';

interface ExtenderButtonProps {
  isExtended: boolean;
  onClick: () => void;
  className?: string;
}

export default function ExtenderButton({
  isExtended,
  onClick,
  className,
}: ExtenderButtonProps) {
  return (
    <button
      className={`${className} flex flex-col gap-1.5 p-3`}
      onClick={onClick}
    >
      <div
        className={`w-8 h-0.5 bg-black rounded-full transition-all relative ${isExtended ? 'translate-y-2 rotate-45' : ''}`}
      />
      <div
        className={`w-8 h-0.5 bg-black rounded-full transition-all ${isExtended ? 'opacity-0' : ''}`}
      />
      <div
        className={`w-8 h-0.5 bg-black rounded-full transition-all relative ${isExtended ? '-translate-y-2 -rotate-45' : ''}`}
      />
    </button>
  );
}
