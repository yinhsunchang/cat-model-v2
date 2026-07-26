import { useEffect } from 'react';

export function useSmoothScroll(): void {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const scrollTarget = document.querySelector<HTMLElement>(href);
        if (scrollTarget) {
          window.scrollTo({
            top: scrollTarget.offsetTop,
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
}
