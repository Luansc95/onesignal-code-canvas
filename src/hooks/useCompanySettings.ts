import { useEffect, useState } from 'react';
import {
  companySettingsService,
  CompanySettingsState
} from '../services/companySettingsService';

/**
 * Disponibiliza as configurações institucionais persistentes para qualquer
 * componente (site público ou admin), com estados de carregamento e erro.
 */
export function useCompanySettings(): CompanySettingsState & { refresh: () => void } {
  const [state, setState] = useState<CompanySettingsState>(() => companySettingsService.getSnapshot());

  useEffect(() => {
    const unsubscribe = companySettingsService.subscribe(setState);
    void companySettingsService.load();
    return unsubscribe;
  }, []);

  return {
    ...state,
    refresh: () => {
      void companySettingsService.refresh();
    }
  };
}
