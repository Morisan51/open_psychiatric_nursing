import { useState, useCallback } from 'react';
import { MASTER_DATA, SCORED_ITEMS } from '../data/masterData';

export interface EvaluationEntry {
  category: string;
  item: string;
  selectedValue: string;
  score: number;
  comment: string;
  isUnknown: boolean;
}

export interface AssessmentState {
  memo: string;
  evaluations: Record<string, EvaluationEntry>;
}

const INITIAL_STATE: AssessmentState = { memo: '', evaluations: {} };

export function useAssessment() {
  const [state, setState] = useState<AssessmentState>(INITIAL_STATE);

  const setMemo = useCallback((memo: string) => {
    setState(prev => ({ ...prev, memo }));
  }, []);

  const selectOption = useCallback((itemKey: string, value: string) => {
    const itemDef = MASTER_DATA.find(i => i.key === itemKey);
    if (!itemDef) return;

    setState(prev => {
      const current = prev.evaluations[itemKey];
      if (current?.selectedValue === value) {
        const next = { ...prev.evaluations };
        delete next[itemKey];
        return { ...prev, evaluations: next };
      }

      const option = itemDef.options.find(o => o.value === value);
      if (!option) return prev;

      return {
        ...prev,
        evaluations: {
          ...prev.evaluations,
          [itemKey]: {
            category: itemDef.category,
            item: itemDef.item,
            selectedValue: value,
            score: option.score ?? 0,
            comment: option.comment,
            isUnknown: option.isUnknown ?? false,
          },
        },
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const totalScore = Object.values(state.evaluations).reduce(
    (sum, e) => sum + e.score,
    0
  );

  const answeredCount = Object.keys(state.evaluations).length;
  const scoredItemCount = SCORED_ITEMS.length; // 22

  const unknownItems = Object.values(state.evaluations).filter(e => e.isUnknown);

  const isComplete = SCORED_ITEMS.every(item => item.key in state.evaluations);

  return {
    state,
    setMemo,
    selectOption,
    reset,
    totalScore,
    answeredCount,
    scoredItemCount,
    unknownItems,
    isComplete,
  };
}
