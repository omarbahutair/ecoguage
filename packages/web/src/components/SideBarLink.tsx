import React, { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SideBarLinkProps {
  to: string;
  highlightWhen: string[];
  label: string;
  icon: string;
}

export default function SideBarLink({
  to,
  highlightWhen,
  label,
  icon,
}: SideBarLinkProps) {
  const location = useLocation();
  const isSelected = useCallback(() => {
    return highlightWhen.some((given) => {
      const pattern = given.replace(/:[^/]+/g, '[^/]+').replace(/\//g, '\\/');
      const regex = new RegExp(`^${pattern}\\/?$`);

      return regex.test(location.pathname);
    });
  }, [location.pathname, highlightWhen]);

  return (
    <Link
      to={to}
      className={`flex items-center justify-center gap-5 px-5 py-3 rounded text-white hover:bg-white hover:bg-opacity-10 transition-all ${isSelected() ? 'bg-white bg-opacity-20' : ''}`}
      style={
        {
          // color: '#2f4f4f',
          // color: '#36454f',
        }
      }
    >
      <i className={icon} />
      <label>{label}</label>
    </Link>
  );
}
