'use client';

import { useEffect, useRef } from 'react';
import { useLoading } from '@/context/LoadingContext';
import { usePathname } from 'next/navigation';

export function useGlobalLoading() {
  const { showLoading, hideLoading } = useLoading();
  const activeRequests = useRef(0);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      clearTimeout(hideTimeout.current!);

      if (activeRequests.current === 0) {
        showLoading();
      }

      activeRequests.current++;

      try {
        return await originalFetch(...args);
      } finally {
        activeRequests.current--;

        if (activeRequests.current === 0) {
          hideTimeout.current = setTimeout(() => {
            hideLoading();
          }, 300);
        }
      }
    };

    return () => {
      window.fetch = originalFetch; // Cleanup
    };
  }, [showLoading, hideLoading]);

  // Listen to route changes (App Router style)
  useEffect(() => {
    if (prevPath.current !== pathname) {
      showLoading();
      // Fake delay to simulate loading
      setTimeout(() => {
        hideLoading();
      }, 300);
      prevPath.current = pathname;
    }
  }, [pathname, showLoading, hideLoading]);
}
