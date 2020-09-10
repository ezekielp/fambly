import { useState, useEffect, RefObject } from 'react';

export const useDetectOutsideClick = (
  element: RefObject<HTMLDivElement>,
  initialState: boolean,
): [boolean, (state: boolean) => void] => {
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const pageClickEvent = (event: MouseEvent): void => {
      if (
        element.current !== null &&
        !element.current.contains(event.target as Node)
      ) {
        setIsActive(!isActive);
      }
    };

    if (isActive) {
      window.addEventListener('click', pageClickEvent);
    }

    return () => {
      window.removeEventListener('click', pageClickEvent);
    };
  }, [isActive, element]);

  return [isActive, setIsActive];
};
