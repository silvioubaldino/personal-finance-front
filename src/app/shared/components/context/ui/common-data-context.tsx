'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, Wallets, getWallets, getCategories } from "@/services/api";

interface CommonDataContextType {
    wallets: Wallets[];
    categories: Category[];
}

interface DataProviderProps {
    children: ReactNode;
}

const DataContext = createContext<CommonDataContextType | undefined>(undefined);

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [wallets, setWallets] = useState<Wallets[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const walletsData = await getWallets();
                setWallets(walletsData);

                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ wallets, categories }}>
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