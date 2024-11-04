'use client';

import React, { useState } from 'react';
import AddButton from '@/app/shared/components/add/ui/AddButton';
import Modal from "@/app/shared/components/add/ui/modal";
import ExpenseForm from "@/app/shared/components/add/ui/expense-form";
import IncomeForm from "@/app/shared/components/add/ui/income-form";
import { DataProvider } from '@/app/shared/components/context/ui/common-data-context';
import styles from '../styles/add.module.css';

const ClientOnlyModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeForm, setActiveForm] = useState<'expense' | 'income'>('expense');

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <DataProvider>
            <AddButton onClick={openModal} />
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className={styles.buttonGroup}>
                    <div
                        className={`${styles.button} ${activeForm === 'expense' ? styles.active : ''}`}
                        onClick={() => setActiveForm('expense')}
                    >
                        Despesa
                    </div>
                    <div
                        className={`${styles.button} ${activeForm === 'income' ? styles.active : ''}`}
                        onClick={() => setActiveForm('income')}
                    >
                        Rendimento
                    </div>
                </div>
                {activeForm === 'expense' ? <ExpenseForm /> : <IncomeForm />}
            </Modal>
        </DataProvider>
    );
};

export default ClientOnlyModal;