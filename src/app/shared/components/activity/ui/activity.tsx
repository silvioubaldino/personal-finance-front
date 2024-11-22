'use client';
import React, {useEffect, useState} from 'react';
import styles from '../styles/activity.module.css';
import {deleteMovement, getMovements, Movement, payMovement, revertPayMovement} from "@/services/api";
import {addHours, format} from 'date-fns';
import {LuCircleSlash2, LuDollarSign, LuIterationCw, LuPenSquare, LuTrash2} from "react-icons/lu";
import {useData} from "@/app/shared/components/context/ui/movements-context";
import {useMonth} from "@/app/shared/components/context/ui/MonthContext";
import ClientOnlyModal from "@/app/shared/components/add/ui/add";
import ConfirmationModal from "@/app/shared/components/confirmationmodal/ui/confirmationModal";
import AddButton from "@/app/shared/components/add/ui/AddButton";

const Activity = () => {
    const [transactions, setTransactions] = useState<Movement[]>([]);
    const {setData} = useData();
    const {currentMonth} = useMonth();
    const [editingMovement, setEditingMovement] = useState<Movement>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [movementIDToDelete, setMovementIDToDelete] = useState<string | null>(null);

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
    useEffect(() => {
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

    const handleDelete = (movementID: string) => {
        setMovementIDToDelete(movementID);
        setIsConfirmationOpen(true);
    };

    const confirmDelete = async () => {
        if (movementIDToDelete) {
            try {
                await deleteMovement(movementIDToDelete);
                const movements = await getMovements(currentMonth.from, currentMonth.to);
                setTransactions(movements);
            } catch (error) {
                console.error(`Failed to delete movement with id ${movementIDToDelete}`, error);
            } finally {
                setIsConfirmationOpen(false);
                setMovementIDToDelete(null);
            }
        }
    };

    return (
        <div className={styles.container}>
            {transactions.map((transaction, index) => (
                <div key={index} className={styles.transaction}>
                    <div className={styles.row}>
                        <div className={styles.description}>
                            <span className={styles.descriptionText}>
                                {transaction.description}
                                {transaction.is_recurrent && <LuIterationCw size={20} title={'Transação recorrente'} className={styles.recurrentIcon}/>}
                            </span>
                            <div className={styles.category}>
                                {transaction.category.description}
                                {transaction.sub_category && transaction.sub_category.id && ` > ${transaction.sub_category.description}`}
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
                            <button title="Apagar" onClick={() => handleDelete(transaction.id)}>
                                <LuTrash2 size={20}/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            <AddButton onUpdateTransactions={fetchMovements}/>
            <ClientOnlyModal
                isEditing={!!editingMovement}
                movement={editingMovement}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdateTransactions={fetchMovements}/>
            <ConfirmationModal
                isOpen={isConfirmationOpen}
                onClose={() => setIsConfirmationOpen(false)}
                onConfirm={confirmDelete}
                message="Apagar movimentação?"/>
        </div>
    );
};

export default Activity;