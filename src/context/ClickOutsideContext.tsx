import React, { useRef, useCallback, createContext } from 'react';

type ClickOutsideCallback = (e: MouseEvent | TouchEvent) => void;

interface ClickOutsideContextType {
  subscribe: (callback: ClickOutsideCallback) => () => void;
}

export const ClickOutsideContext = createContext<ClickOutsideContextType>({
  subscribe: () => () => {},
});

export const ClickOutsideProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const callbacksRef = useRef<Set<ClickOutsideCallback>>(new Set());

  const subscribe = useCallback((callback: ClickOutsideCallback) => {
    callbacksRef.current.add(callback);
    return () => {
      callbacksRef.current.delete(callback);
    };
  }, []);

  const handleCapture = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    console.log('Event captured:', event.type);
    callbacksRef.current.forEach((cb) => cb(event.nativeEvent));
  };

  return (
    <ClickOutsideContext.Provider value={{ subscribe }}>
      <div onClickCapture={handleCapture} onTouchStartCapture={handleCapture}>
        {children}
      </div>
    </ClickOutsideContext.Provider>
  );
};
