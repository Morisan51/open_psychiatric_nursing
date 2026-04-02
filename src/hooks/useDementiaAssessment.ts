import { useState, useCallback, useEffect } from 'react';
import type { DementiaDirectionKey } from '../data/dementiaAssessmentData';

const STORAGE_KEY = 'dementia-current';

export interface DementiaBasicInfo {
  gender: string;
  age: string;
  diagnosis: string;
  comorbidities: string;
}

export interface DementiaState {
  basicInfo: DementiaBasicInfo;
  direction: DementiaDirectionKey | null;
  directionReason: string;
  radioAnswers: Record<string, string>;
  checkboxAnswers: Record<string, string[]>;
  textAnswers: Record<string, string>;
  memo: string;
}

const EMPTY_BASIC_INFO: DementiaBasicInfo = {
  gender: '',
  age: '',
  diagnosis: '',
  comorbidities: '',
};

const INITIAL_STATE: DementiaState = {
  basicInfo: EMPTY_BASIC_INFO,
  direction: null,
  directionReason: '',
  radioAnswers: {},
  checkboxAnswers: {},
  textAnswers: {},
  memo: '',
};

function loadFromStorage(): DementiaState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...INITIAL_STATE, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return INITIAL_STATE;
}

export function useDementiaAssessment() {
  const [state, setState] = useState<DementiaState>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setBasicInfo = useCallback((field: keyof DementiaBasicInfo, value: string) => {
    setState(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value },
    }));
  }, []);

  const setDirection = useCallback((direction: DementiaDirectionKey) => {
    setState(prev => ({ ...prev, direction }));
  }, []);

  const setDirectionReason = useCallback((reason: string) => {
    setState(prev => ({ ...prev, directionReason: reason }));
  }, []);

  const setRadio = useCallback((key: string, value: string) => {
    setState(prev => {
      // 再タップで解除
      if (prev.radioAnswers[key] === value) {
        const next = { ...prev.radioAnswers };
        delete next[key];
        return { ...prev, radioAnswers: next };
      }
      return { ...prev, radioAnswers: { ...prev.radioAnswers, [key]: value } };
    });
  }, []);

  const toggleCheckbox = useCallback((key: string, value: string) => {
    setState(prev => {
      const current = prev.checkboxAnswers[key] ?? [];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, checkboxAnswers: { ...prev.checkboxAnswers, [key]: next } };
    });
  }, []);

  const setText = useCallback((key: string, value: string) => {
    setState(prev => ({ ...prev, textAnswers: { ...prev.textAnswers, [key]: value } }));
  }, []);

  const setMemo = useCallback((memo: string) => {
    setState(prev => ({ ...prev, memo }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    state,
    setBasicInfo,
    setDirection,
    setDirectionReason,
    setRadio,
    toggleCheckbox,
    setText,
    setMemo,
    reset,
  };
}
