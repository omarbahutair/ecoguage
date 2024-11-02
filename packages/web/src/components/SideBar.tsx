import React, { useMemo } from 'react';
import SideBarLink from './SideBarLink';

interface SideBarProps {
  className?: string;
}

export default function SideBar({ className }: SideBarProps) {
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
        <SideBarLink key={link.to} {...link} />
      ))}
    </div>
  );
}
