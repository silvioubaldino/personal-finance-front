'use client';
import React, { useMemo } from 'react';
import { useData } from "@/app/shared/components/context/ui/context";
import styles from '../styles/total-expenses.module.css';

const TotalExpenses = () => {
    const { data } = useData();

    const totalExpenses = useMemo(() => {
        return data.
        filter(item => item.is_paid).
        reduce((sum, item) => sum + item.amount, 0);
    }, [data]);

    return (
        <div className={styles.totalExpensesContainer}>
            <span className={styles.label}>Gastos totais: </span>
            <span className={styles.value}>{totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
    );
};

export default TotalExpenses;