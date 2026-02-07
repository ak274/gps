import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useSmoothScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, scroll to that element
    if (hash) {
      // Use requestAnimationFrame for better timing and fallback with setTimeout
      const scrollToElement = () => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      };

      // First attempt after a frame for component render
      requestAnimationFrame(() => {
        // Second attempt with small delay to ensure DOM fully renders
        setTimeout(scrollToElement, 100);
      });
    } else {
      // Scroll to top if no hash
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);
}
