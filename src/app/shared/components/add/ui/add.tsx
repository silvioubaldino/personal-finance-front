import React, {useEffect, useState} from 'react';
import Modal from "@/app/shared/components/add/ui/modal";
import ExpenseForm from "@/app/shared/components/add/ui/expense-form";
import IncomeForm from "@/app/shared/components/add/ui/income-form";
import {DataProvider} from '@/app/shared/components/context/ui/common-data-context';
import styles from '../styles/add.module.css';
import {Movement} from "@/services/api";

type ClientOnlyModalProps = {
    isEditing: boolean;
    movement?: Movement;
    isOpen: boolean;
    onClose: () => void;
    onUpdateTransactions: () => Promise<void>;
};

const ClientOnlyModal: React.FC<ClientOnlyModalProps> = ({
                                                             isEditing,
                                                             movement,
                                                             isOpen,
                                                             onClose,
                                                             onUpdateTransactions
                                                         }) => {
    const [activeForm, setActiveForm] = useState<'expense' | 'income'>('expense');

    useEffect(() => {
        if (isEditing && movement) {
            if (movement.amount > 0) {
                setActiveForm('income');
            } else {
                setActiveForm('expense');
            }
        }
    }, [isEditing, movement]);

    return (
        <DataProvider>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className={styles.buttonGroup}>
                    <div
                        className={`${styles.button} ${activeForm === 'expense' ? styles.active : ''} ${isEditing ? styles.buttonDisabled : ''}`}
                        onClick={() => setActiveForm('expense')}
                    >
                        Despesa
                    </div>
                    <div
                        className={`${styles.button} ${activeForm === 'income' ? styles.active : ''} ${isEditing ? styles.buttonDisabled : ''}`}
                        onClick={() => setActiveForm('income')}
                    >
                        Rendimento
                    </div>
                </div>
                {activeForm === 'expense' ?
                    <ExpenseForm
                        isEditing={isEditing}
                        movement={movement}
                        onUpdateTransactions={onUpdateTransactions}/> :
                    <IncomeForm
                        isEditing={isEditing}
                        movement={movement}
                        onUpdateTransactions={onUpdateTransactions}/>}
            </Modal>
        </DataProvider>
    );
};

export default ClientOnlyModal;