import React, { useState } from 'react';
import styles from '../styles/modal-add-estimate.module.css';

const mockCat = [
    { id: '1', name: 'Categoria 1' },
    { id: '2', name: 'Categoria 2' },
    { id: '3', name: 'Categoria 3' },
];

interface ModalFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Lógica para enviar os dados do formulário
        console.log('Categoria:', selectedCategory, 'Valor:', amount);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Adicionar Novo Planejamento</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="category">Categoria</label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Selecione uma categoria</option>
                            {mockCat.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="amount">Valor Monetário</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className={styles.formActions}>
                        <button type="submit">Adicionar</button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalForm;