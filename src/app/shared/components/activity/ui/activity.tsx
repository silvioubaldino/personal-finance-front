'use client';
import React, {useEffect, useState} from 'react';
import styles from '../styles/activity.module.css';
import {getMovements, Movement, payMovement, revertPayMovement} from "@/services/api";
import {addHours, format} from 'date-fns';
import {LuCircleSlash2, LuDollarSign, LuPenSquare} from "react-icons/lu";
import {useData} from "@/app/shared/components/context/ui/movements-context";
import {useMonth} from "@/app/shared/components/context/ui/MonthContext";
import ClientOnlyModal from "@/app/shared/components/add/ui/add";

const Activity = () => {
    const [transactions, setTransactions] = useState<Movement[]>([]);
    const {setData} = useData();
    const {currentMonth} = useMonth();
    const [editingMovement, setEditingMovement] = useState<Movement>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                if (currentMonth.from && currentMonth.to) {
                    const movements = await getMovements(currentMonth.from, currentMonth.to);
                    setTransactions(movements);
                    setData(movements);
                }
            } catch (error) {
                console.error('Failed to fetch movements:', error);
            }
        };

        fetchMovements();
    }, [currentMonth]);

    const handlePay = async (id: string) => {
        try {
            await payMovement(id);
            const movements = await getMovements(currentMonth.from, currentMonth.to);
            setTransactions(movements);
        } catch (error) {
            console.error(`Failed to pay movement with id ${id}`, error);
        }
    };

    const handleRevertPay = async (id: string) => {
        try {
            await revertPayMovement(id);
            const movements = await getMovements(currentMonth.from, currentMonth.to);
            setTransactions(movements);
        } catch (error) {
            console.error(`Failed to revert pay movement with id ${id}`, error);
        }
    };

    const handleEdit = (movement: Movement) => {
        setEditingMovement(movement);
        setIsModalOpen(true);
    };

    return (
        <div className={styles.container}>
            {transactions.map((transaction, index) => (
                <div key={index} className={styles.transaction}>
                    <div className={styles.row}>
                        <div className={styles.description}>
                            {transaction.description}
                            <div className={styles.category}>
                                {transaction.category.description}
                                {transaction.sub_category && transaction.sub_category.id &&` > ${transaction.sub_category.description}`}
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
                                {transaction.wallet.description}
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
                            <button title="Editar" onClick={() => handleEdit(transaction)}>
                                <LuPenSquare size={20}/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <ClientOnlyModal
                isEditing={!!editingMovement}
                movement={editingMovement}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}/>
        </div>
    );
};

export default Activity;