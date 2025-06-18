import React, { createContext, useContext, ReactNode } from 'react';

interface FormProviderProps {
  locale: string;
  messages: Record<string, string>;
  children: ReactNode;
}

const I18nContext = createContext<FormProviderProps | null>(null);

export function FormProvider({ locale, messages, children }: FormProviderProps) {
  return (
    <I18nContext.Provider value={{ locale, messages, children }}>
      {children}
    </I18nContext.Provider>
  );
}

// Hook to consume locale/messages
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within a FormProvider');
  return { locale: ctx.locale, messages: ctx.messages };
}
