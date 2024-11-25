import React from 'react';
import styles from '../styles/confirmation-modal.module.css';

type RecurrentTypeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirmSingle: () => void;
    onConfirmAll: () => void;
    message: string;
};

const RecurrentTypeModal: React.FC<RecurrentTypeModalProps> = ({ isOpen, onClose, onConfirmSingle, onConfirmAll, message }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p>{message}</p>
                <div className={styles.buttonGroup}>
                    <button onClick={onConfirmSingle} className={styles.cancelButton}>Apenas este</button>
                    <button onClick={onConfirmAll} className={styles.cancelButton}>Todos os próximos</button>
                </div>
            </div>
        </div>
    );
};

export default RecurrentTypeModal;