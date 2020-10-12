import { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {}

export const ScrollToTop: FC<ScrollToTopProps> = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
