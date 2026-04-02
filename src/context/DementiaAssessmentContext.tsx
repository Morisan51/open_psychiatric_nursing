import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useDementiaAssessment } from '../hooks/useDementiaAssessment';

type DementiaAssessmentContextType = ReturnType<typeof useDementiaAssessment>;

const DementiaAssessmentContext = createContext<DementiaAssessmentContextType | null>(null);

export function DementiaAssessmentProvider({ children }: { children: ReactNode }) {
  const value = useDementiaAssessment();
  return (
    <DementiaAssessmentContext.Provider value={value}>
      {children}
    </DementiaAssessmentContext.Provider>
  );
}

export function useDementiaAssessmentContext() {
  const ctx = useContext(DementiaAssessmentContext);
  if (!ctx) throw new Error('useDementiaAssessmentContext must be inside DementiaAssessmentProvider');
  return ctx;
}
