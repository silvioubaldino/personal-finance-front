'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
    data: any[];
    setData: React.Dispatch<React.SetStateAction<any[]>>;
}

interface DataProviderProps {
    children: ReactNode;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [data, setData] = useState<any[]>([]);

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};