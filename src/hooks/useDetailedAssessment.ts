import { useState, useCallback } from 'react';
import type { DetailedItem } from '../data/detailedAssessmentData';

export interface DetailedEvalEntry {
  category: string;
  item: string;
  selectedValue: string;
  score: number;
  comment: string;
  isUnknown: boolean;
}

export interface DetailedAssessmentState {
  // カテゴリごとに選択された分岐
  selectedBranches: Record<string, string>;
  evaluations: Record<string, DetailedEvalEntry>;
  memo: string;
}

const INITIAL_STATE: DetailedAssessmentState = {
  selectedBranches: {},
  evaluations: {},
  memo: '',
};

export function useDetailedAssessment(items: DetailedItem[]) {
  const [state, setState] = useState<DetailedAssessmentState>(INITIAL_STATE);

  const selectBranch = useCallback((categoryName: string, branchKey: string) => {
    setState(prev => ({
      ...prev,
      selectedBranches: { ...prev.selectedBranches, [categoryName]: branchKey },
    }));
  }, []);

  const selectOption = useCallback((itemKey: string, value: string) => {
    const itemDef = items.find(i => i.key === itemKey);
    if (!itemDef) return;

    setState(prev => {
      const current = prev.evaluations[itemKey];
      // 再タップで解除
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
            score: option.score,
            comment: '',
            isUnknown: option.isUnknown ?? false,
          },
        },
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const setComment = useCallback((itemKey: string, comment: string) => {
    setState(prev => {
      const entry = prev.evaluations[itemKey];
      if (!entry) return prev;
      return {
        ...prev,
        evaluations: {
          ...prev.evaluations,
          [itemKey]: { ...entry, comment },
        },
      };
    });
  }, []);

  const setMemo = useCallback((memo: string) => {
    setState(prev => ({ ...prev, memo }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // カテゴリの合計スコア
  const getCategoryScore = useCallback((categoryName: string): number => {
    return Object.values(state.evaluations)
      .filter(e => e.category === categoryName && !e.isUnknown)
      .reduce((sum, e) => sum + e.score, 0);
  }, [state.evaluations]);

  // 全体の合計スコア
  const totalScore = Object.values(state.evaluations)
    .filter(e => !e.isUnknown)
    .reduce((sum, e) => sum + e.score, 0);

  // 評価済み項目数
  const answeredCount = Object.keys(state.evaluations).length;

  // 不明の項目数
  const unknownCount = Object.values(state.evaluations).filter(e => e.isUnknown).length;

  return {
    state,
    selectBranch,
    selectOption,
    setComment,
    setMemo,
    reset,
    getCategoryScore,
    totalScore,
    answeredCount,
    unknownCount,
  };
}
