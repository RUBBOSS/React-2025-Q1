import { useContext, useEffect, useRef, RefObject } from 'react';
import { ClickOutsideContext } from '../context/ClickOutsideContext';

type Handler = (event: MouseEvent | TouchEvent) => void;

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler
) => {
  const context = useContext(ClickOutsideContext);
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
    if (!context) return;
    const callback = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      console.log('Outside click detected:', event.type);
      handlerRef.current(event);
    };
    const unsubscribe = context.subscribe(callback);
    return unsubscribe;
  }, [ref, context]);
};

export default useOnClickOutside;
