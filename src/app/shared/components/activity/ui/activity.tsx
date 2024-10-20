'use client';
import React, {useEffect, useState} from 'react';
import styles from '../styles/activity.module.css';
import {getMovements, Movement} from "@/services/api";
import { format } from 'date-fns';

const Activity = () => {
    const [transactions, setTransactions] = useState<Movement[]>([]);

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                const movements = await getMovements('2023-07-01', '2023-07-02');
                setTransactions(movements);
            } catch (error) {
                console.error('Failed to fetch movements:', error);
            }
        };

        fetchMovements();
    }, []);
    return (
        <div className={styles.container}>
            {transactions.map((transaction, index) => (
                <div key={index} className={styles.transaction}>
                    <div className={styles.row}>
                        <div className={styles.description}>{transaction.description}</div>
                        <div className={styles.amount}>{transaction.amount.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.category}>
                            {transaction.category}
                            {transaction.sub_category && ` > ${transaction.sub_category}`}
                        </div>
                        <div className={styles.date}>{format(new Date(transaction.date), 'dd-MM-yyyy')}</div>
                        <div className={styles.wallet}>{transaction.wallet}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Activity;