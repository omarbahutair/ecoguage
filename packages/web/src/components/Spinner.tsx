import React, { useCallback } from 'react';
import { primary } from '../colors';
import { ScaleLoader } from 'react-spinners';

interface SpinnerProps {
  isLoading: boolean;
  size: 'medium';
  color: 'white' | 'primary';
}

export default function Spinner({ color, isLoading, size }: SpinnerProps) {
  const getHeight = useCallback(() => {
    switch (size) {
      case 'medium':
        return 16;
    }
  }, [size]);

  const getWidth = useCallback(() => {
    switch (size) {
      case 'medium':
        return 2;
    }
  }, [size]);

  const getMargin = useCallback(() => {
    switch (size) {
      case 'medium':
        return 1;
    }
  }, [size]);

  const getColor = useCallback(() => {
    switch (color) {
      case 'primary':
        return primary;
      case 'white':
        return 'white';
    }
  }, [color]);

  return (
    <ScaleLoader
      loading={isLoading}
      height={getHeight()}
      width={getWidth()}
      margin={getMargin()}
      color={getColor()}
    />
  );
}
