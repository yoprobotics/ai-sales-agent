// Barrel export file - redirects to the actual implementation
// This prevents circular reference by explicitly NOT exporting from itself

// Import from the actual implementation file
import { useI18n as useI18nHook, I18nProvider as I18nProviderComponent } from './use-i18n.tsx';

// Re-export with same names
export const useI18n = useI18nHook;
export const I18nProvider = I18nProviderComponent;
