'use client';
import React, {useEffect, useState} from 'react';
import styles from '../styles/balance.module.css';
import {getBalance} from "@/services/api";

// this value will be got from redux
const getFrom = () => {
    return '2021-01-01';
}

// this value will be got from redux
const getTo = () => {
    return '2023-12-30';
}

const Balance = () => {
    const [balance, setBalance] = useState({ expense: 0, income: 0, period_balance: 0 });
    let from = getFrom()
    let to = getTo()
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await getBalance(from, to);
                setBalance(data);
            } catch (error) {
                console.error('Failed to fetch balance:', error);
            }
        };

        fetchBalance();
    }, [from, to]);
    return (
        <div className={styles.container}>
            <div className={styles.valueGreen}>{balance.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <div className={styles.valueRed}>{balance.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
            <div className={styles.valueYellow}>{balance.period_balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
        </div>
    );
};

export default Balance;