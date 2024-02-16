import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';

import type { RootState, AppDispatch } from './store';

// Hooks for redux

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom text overflow hook

export function useDetectOverflow<T extends HTMLElement>(
  direction: 'horizontal' | 'vertical'
): [boolean, React.RefObject<T>] {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (direction === 'horizontal') {
      if (ref && ref.current) {
        if (ref.current.scrollWidth > ref.current.clientWidth) {
          setIsOverflowed(true);
        } else {
          setIsOverflowed(false);
        }
      }
    } else if (direction === 'vertical') {
      if (ref && ref.current) {
        if (ref.current.scrollHeight > ref.current.clientHeight) {
          setIsOverflowed(true);
        } else {
          setIsOverflowed(false);
        }
      }
    }
  }, [windowWidth]);

  return [isOverflowed, ref];
}
