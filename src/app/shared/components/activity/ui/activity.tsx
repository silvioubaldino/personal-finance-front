'use client';
import React, {useEffect, useState} from 'react';
import styles from '../styles/activity.module.css';
import {getMovements, Movement, payMovement, revertPayMovement} from "@/services/api";
import {addHours, format} from 'date-fns';
import {LuCircleSlash2, LuDollarSign} from "react-icons/lu";
import {useData} from "@/app/shared/components/context/ui/context";

const dateFrom = '2024-10-20';
const dateTo = '2024-10-21';

const Activity = () => {
    const [transactions, setTransactions] = useState<Movement[]>([]);
    const {setData} = useData();

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                const movements = await getMovements(dateFrom, dateTo);
                setTransactions(movements);
                setData(movements);
            } catch (error) {
                console.error('Failed to fetch movements:', error);
            }
        };

        fetchMovements();
    }, []);

    const handlePay = async (id: string) => {
        try {
            await payMovement(id);
            const movements = await getMovements(dateFrom, dateTo);
            setTransactions(movements);
        } catch (error) {
            console.error(`Failed to pay movement with id ${id}`, error);
        }
    };

    const handleRevertPay = async (id: string) => {
        try {
            await revertPayMovement(id);
            const movements = await getMovements(dateFrom, dateTo);
            setTransactions(movements);
        } catch (error) {
            console.error(`Failed to revert pay movement with id ${id}`, error);
        }
    };

    return (
        <div className={styles.container}>
            {transactions.map((transaction, index) => (
                <div key={index} className={styles.transaction}>
                    <div className={styles.row}>
                        <div className={styles.description}>
                            {transaction.description}
                            <div className={styles.category}>
                                {transaction.category}
                                {transaction.sub_category && ` > ${transaction.sub_category}`}
                            </div>
                        </div>
                        <div className={styles.date}>
                            {format(addHours(new Date(transaction.date), 12), 'dd-MM-yyyy')}
                        </div>
                        <div className={styles.amountWallet}>
                            <div className={styles.amount}>
                                {transaction.amount.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </div>
                            <div className={styles.wallet}>
                                {transaction.wallet}
                            </div>
                        </div>
                        <div className={transaction.is_paid ? styles.paid : styles.notPaid}>
                            {transaction.is_paid ? 'Pago' : 'Não pago'}
                        </div>
                        <div className={styles.actionButton}>
                            {transaction.is_paid ? (
                                <button title="Reverter pagamento" onClick={() => handleRevertPay(transaction.id)}>
                                    <LuCircleSlash2 size={20}/>
                                </button>
                            ) : (
                                <button title="Pagar" onClick={() => handlePay(transaction.id)}>
                                    <LuDollarSign size={20}/>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Activity;