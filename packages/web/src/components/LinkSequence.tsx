import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ILink {
  label: string;
  to: string;
}

interface LinkSequenceProps {
  sequence: ILink[];
}

export default function LinkSequence({ sequence }: LinkSequenceProps) {
  const location = useLocation();

  return (
    <div className="flex items-center gap-4 text-primary-fade">
      {sequence.map((link, idx) => (
        <>
          {idx ? <i className="fa-solid fa-chevron-right text-xs" /> : null}
          <Link
            to={link.to}
            className={location.pathname === link.to ? 'font-semibold' : ''}
          >
            {link.label}
          </Link>
        </>
      ))}
    </div>
  );
}
