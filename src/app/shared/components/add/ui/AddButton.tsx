'use client';
import React, {useState} from 'react';
import styles from '../styles/add.module.css';
import {LuPlus} from 'react-icons/lu';
import ClientOnlyModal from "@/app/shared/components/add/ui/add";

type AddButtonProps = {
    onUpdateTransactions: () => Promise<void>;
}
const AddButton: React.FC<AddButtonProps> = ({onUpdateTransactions}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button className={styles.buttonAdd} onClick={() => setIsModalOpen(true)}>
                {<LuPlus size={30} color="#C9AD72"/>}
            </button>
            <ClientOnlyModal
                isEditing={false}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdateTransactions={onUpdateTransactions}
            />
        </>
    );
};

export default AddButton;