import React, { useMemo } from 'react';
import SideBarLink from './SideBarLink';

interface SideBarProps {
  className?: string;
  onLinkClick?: () => void;
}

export default function SideBar({ className, onLinkClick }: SideBarProps) {
  const links = useMemo(
    () => [
      {
        label: 'Dashboard',
        to: '/dashboard',
        icon: 'fa-solid fa-gauge',
        highlightWhen: ['/dashboard', '/buildings/:id'],
      },
      {
        label: 'Trash',
        to: '/trash',
        icon: 'fa-solid fa-trash',
        highlightWhen: ['/trash'],
      },
    ],
    [],
  );

  return (
    <div className={`${className} flex flex-col gap-1 p-4`}>
      {links.map((link) => (
        <SideBarLink onClick={onLinkClick} key={link.to} {...link} />
      ))}
    </div>
  );
}
