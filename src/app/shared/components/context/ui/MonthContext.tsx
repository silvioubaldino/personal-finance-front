'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MonthContextProps {
  currentMonth: { from: string; to: string };
  setCurrentMonth: (month: string) => void;
}

const MonthContext = createContext<MonthContextProps | undefined>(undefined);

export const MonthProvider = ({ children }: { children: ReactNode }) => {
  const [currentMonth, setCurrentMonth] = useState<{ from: string; to: string }>({ from: '', to: '' });

  const updateCurrentMonth = (month: string) => {
    const monthsPortuguese = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ];
    const monthIndex = monthsPortuguese.indexOf(month);
    const now = new Date();
    const from = new Date(now.getFullYear(), monthIndex, 1).toISOString().split('T')[0];
    const to = new Date(now.getFullYear(), monthIndex + 1, 0).toISOString().split('T')[0];
    setCurrentMonth({ from, to });
  };

  return (
    <MonthContext.Provider value={{ currentMonth, setCurrentMonth: updateCurrentMonth }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = (): MonthContextProps => {
  const context = useContext(MonthContext);
  if (!context) {
    throw new Error('useMonth must be used within a MonthProvider');
  }
  return context;
};