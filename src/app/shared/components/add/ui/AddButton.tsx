import React from 'react';
import styles from '../styles/add.module.css';
import {LuPlus} from 'react-icons/lu';

interface AddButtonProps {
    onClick: () => void;
}

const AddButton = ({ onClick }: AddButtonProps) => {
    return (
        <button className={styles.buttonAdd} onClick={onClick}>
            {<LuPlus size={30} color="#C9AD72"/>}
        </button>
    );
};

export default AddButton;