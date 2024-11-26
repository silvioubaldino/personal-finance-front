'use client';
import React, {useEffect, useState} from 'react';
import styles from '../styles/balance.module.css';
import {getBalance} from "@/services/api";
import {useMonth} from "@/app/shared/components/context/ui/MonthContext";

const Balance = () => {
    const [balance, setBalance] = useState({ expense: 0, income: 0, period_balance: 0 });
    const { currentMonth } = useMonth();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                if (currentMonth.from && currentMonth.to) {
                    const data = await getBalance(currentMonth.from, currentMonth.to);
                    setBalance(data);
                }
            } catch (error) {
                console.error('Failed to fetch balance:', error);
            }
        };

        fetchBalance();
    }, [currentMonth]);
    return (
        <div className={styles.container}>
            <div className={styles.valueGreen}>{balance.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <div className={styles.valueRed}>{balance.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <div className={styles.valueYellow}>{balance.period_balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        </div>
    );
};

export default Balance;