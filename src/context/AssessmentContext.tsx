import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAssessment } from '../hooks/useAssessment';

type AssessmentContextType = ReturnType<typeof useAssessment> & {
  resetAssessment: () => void;
};

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const assessment = useAssessment();

  return (
    <AssessmentContext.Provider value={{ ...assessment, resetAssessment: assessment.reset }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessmentContext() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessmentContext must be inside AssessmentProvider');
  return ctx;
}
