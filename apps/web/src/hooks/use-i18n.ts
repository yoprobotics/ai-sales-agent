// Re-export the i18n hook from use-i18n.tsx
// TypeScript will automatically resolve to .tsx file
// @ts-ignore - circular dependency workaround
import { useI18n as useI18nImpl } from './use-i18n';

export const useI18n = useI18nImpl;