import React from 'react';
import LogoImage from '../assets/logo.png';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return <img src={LogoImage} className={className ?? 'w-32'} />;
}
