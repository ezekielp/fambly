import { useState, useEffect, RefObject } from 'react';

export const useDetectOutsideClick = (
  element: RefObject<HTMLDivElement>,
  initialState: boolean,
): [boolean, (state: boolean) => void] => {
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const eventListener = (event: MouseEvent): void => {
      if (
        // Do nothing if clicking ref's element or descendent elements
        !element.current ||
        element.current.contains(event.target as Node)
      ) {
        return;
      }
      setIsActive(!isActive);
    };

    if (isActive) {
      window.addEventListener('mousedown', eventListener);
    }

    return () => {
      window.removeEventListener('mousedown', eventListener);
    };
  }, [isActive, element]);

  return [isActive, setIsActive];
};
