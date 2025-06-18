import React, { createContext, useContext, ReactNode } from 'react';

type EventPayload = Record<string, unknown>;
type OnEvent = (name: string, data: EventPayload) => void;

const AnalyticsContext = createContext<OnEvent | null>(null);

export function AnalyticsProvider({
  onEvent,
  children,
}: {
  onEvent: OnEvent;
  children: ReactNode;
}) {
  return (
    <AnalyticsContext.Provider value={onEvent}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error('useAnalytics must be used within AnalyticsProvider');
  return ctx;
}
