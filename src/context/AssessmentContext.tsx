import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAssessment } from '../hooks/useAssessment';
import type { EvaluationItem } from '../data/masterData';
import {
  MASTER_DATA, SCORED_ITEMS, CATEGORIES, CATEGORY_COLORS, ITEMS_BY_CATEGORY, MAX_SCORE, getJudgment,
} from '../data/masterData';
import {
  PSW_MASTER_DATA, PSW_SCORED_ITEMS, PSW_CATEGORIES, PSW_CATEGORY_COLORS, PSW_ITEMS_BY_CATEGORY, PSW_MAX_SCORE, getPswJudgment,
} from '../data/pswMasterData';
import {
  LONG_TERM_MASTER_DATA, LONG_TERM_SCORED_ITEMS, LONG_TERM_CATEGORIES, LONG_TERM_CATEGORY_COLORS, LONG_TERM_ITEMS_BY_CATEGORY, LONG_TERM_MAX_SCORE, getLongTermJudgment,
} from '../data/longTermMasterData';

export type AssessmentType = 'nurse' | 'psw' | 'long_term';

type AssessmentContextType = ReturnType<typeof useAssessment> & {
  resetAssessment: () => void;
  assessmentType: AssessmentType;
  setAssessmentType: (type: AssessmentType) => void;
  // 現在の評価種別に応じたデータ層
  categories: readonly string[];
  categoryColors: Record<string, string>;
  itemsByCategory: Record<string, EvaluationItem[]>;
  maxScore: number;
  scoredItems: EvaluationItem[];
  getJudgmentFn: (score: number) => { level: 'low' | 'mid' | 'high'; text: string };
};

const AssessmentContext = createContext<AssessmentContextType | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [assessmentType, setAssessmentTypeState] = useState<AssessmentType>('nurse');

  const activeMasterData =
    assessmentType === 'nurse' ? MASTER_DATA :
    assessmentType === 'psw'  ? PSW_MASTER_DATA :
    LONG_TERM_MASTER_DATA;
  const activeScoredItems =
    assessmentType === 'nurse' ? SCORED_ITEMS :
    assessmentType === 'psw'  ? PSW_SCORED_ITEMS :
    LONG_TERM_SCORED_ITEMS;

  const assessment = useAssessment(activeMasterData, activeScoredItems);

  const setAssessmentType = useCallback((type: AssessmentType) => {
    setAssessmentTypeState(type);
    assessment.reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories =
    assessmentType === 'nurse' ? CATEGORIES :
    assessmentType === 'psw'  ? PSW_CATEGORIES :
    LONG_TERM_CATEGORIES;
  const categoryColors =
    assessmentType === 'nurse' ? CATEGORY_COLORS :
    assessmentType === 'psw'  ? PSW_CATEGORY_COLORS :
    LONG_TERM_CATEGORY_COLORS;
  const itemsByCategory =
    assessmentType === 'nurse' ? ITEMS_BY_CATEGORY :
    assessmentType === 'psw'  ? PSW_ITEMS_BY_CATEGORY :
    LONG_TERM_ITEMS_BY_CATEGORY;
  const maxScore =
    assessmentType === 'nurse' ? MAX_SCORE :
    assessmentType === 'psw'  ? PSW_MAX_SCORE :
    LONG_TERM_MAX_SCORE;
  const getJudgmentFn =
    assessmentType === 'nurse' ? getJudgment :
    assessmentType === 'psw'  ? getPswJudgment :
    getLongTermJudgment;

  return (
    <AssessmentContext.Provider value={{
      ...assessment,
      resetAssessment: assessment.reset,
      assessmentType,
      setAssessmentType,
      categories,
      categoryColors,
      itemsByCategory,
      maxScore,
      scoredItems: activeScoredItems,
      getJudgmentFn,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessmentContext() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessmentContext must be inside AssessmentProvider');
  return ctx;
}
