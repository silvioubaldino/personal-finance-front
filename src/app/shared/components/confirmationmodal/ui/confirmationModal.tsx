import React from 'react';
import styles from '../styles/confirmation-modal.module.css';

type ConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p>{message}</p>
                <div className={styles.buttonGroup}>
                    <button onClick={onConfirm} className={styles.confirmButton}>Apagar</button>
                    <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;