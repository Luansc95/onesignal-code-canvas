import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { AdminUser } from '../types';

interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
}

/** Mantém componentes sincronizados com a sessão real do Supabase. */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: authService.getCurrentUser(),
    isLoading: authService.isLoading()
  });

  useEffect(() => {
    const sync = () =>
      setState({ user: authService.getCurrentUser(), isLoading: authService.isLoading() });

    const unsubscribe = authService.subscribe(sync);
    void authService.initialize().then(sync);
    sync();

    return () => {
      unsubscribe();
    };
  }, []);

  return state;
}
