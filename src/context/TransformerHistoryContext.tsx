import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ParsedTransformerData } from '../types/TransformerData';

interface Value {
  history: ParsedTransformerData[];
  appendReading: (d: ParsedTransformerData) => void;
}

const Ctx = createContext<Value | undefined>(undefined);

export const TransformerHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<ParsedTransformerData[]>([]);

  const appendReading = useCallback((d: ParsedTransformerData) => {
    setHistory((prev) => [...prev.slice(-199), d]);
  }, []);

  const value = useMemo(() => ({ history, appendReading }), [history, appendReading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useTransformerHistory() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTransformerHistory must be used within TransformerHistoryProvider');
  return v;
}
