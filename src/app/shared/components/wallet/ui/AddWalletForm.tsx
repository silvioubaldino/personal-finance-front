import React, { useState } from 'react';
import styles from '../styles/AddWalletForm.module.css';

interface AddWalletFormProps {
    onSubmit: (name: string, initialBalance: number, initialDate: string) => void;
}

const AddWalletForm: React.FC<AddWalletFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [initialBalance, setInitialBalance] = useState(0);
    const [initialDate, setInitialDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, initialBalance, initialDate);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label>Nome:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
                <label>Saldo inicial:</label>
                <input type="number" value={initialBalance} onChange={(e) => setInitialBalance(parseFloat(e.target.value))} required />
            </div>
            <div className={styles.formGroup}>
                <label>Data do saldo inicial:</label>
                <input type="date" value={initialDate} onChange={(e) => setInitialDate(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitButton}>Adicionar</button>
        </form>
    );
};

export default AddWalletForm;