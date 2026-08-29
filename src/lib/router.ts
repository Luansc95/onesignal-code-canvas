/**
 * Centralized Client-side Router & Navigation Helper
 * Handles HTML5 History API, path matching, query params, and route transitions
 */

import { useState, useEffect } from 'react';

export interface RouteState {
  path: string;
  params: Record<string, string>;
  search: string;
  hash: string;
}

type RouteListener = (route: RouteState) => void;
const listeners = new Set<RouteListener>();

function getCurrentRoute(): RouteState {
  if (typeof window === 'undefined') {
    return { path: '/', params: {}, search: '', hash: '' };
  }

  const pathname = window.location.pathname || '/';
  const search = window.location.search || '';
  const hash = window.location.hash || '';

  // Extract params like /projetos/:slug
  const params: Record<string, string> = {};
  if (pathname.startsWith('/projetos/')) {
    const slug = pathname.replace('/projetos/', '').trim();
    if (slug) params.slug = slug;
  }

  return { path: pathname, params, search, hash };
}

let currentRoute = getCurrentRoute();

export function navigate(to: string, replace = false): void {
  if (typeof window === 'undefined') return;

  if (replace) {
    window.history.replaceState(null, '', to);
  } else {
    window.history.pushState(null, '', to);
  }

  currentRoute = getCurrentRoute();
  listeners.forEach((listener) => listener(currentRoute));

  // Scroll to top unless hash is present
  if (!to.includes('#')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    currentRoute = getCurrentRoute();
    listeners.forEach((listener) => listener(currentRoute));
  });
}

export function useRouter(): RouteState & { navigate: typeof navigate } {
  const [route, setRoute] = useState<RouteState>(currentRoute);

  useEffect(() => {
    const handler = (newRoute: RouteState) => {
      setRoute(newRoute);
    };

    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return {
    ...route,
    navigate
  };
}
