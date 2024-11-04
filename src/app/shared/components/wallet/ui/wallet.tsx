'use client';

import React, {useEffect, useState} from 'react';
import styles from '../styles/wallet.module.css';
import {addWallet, getWallets, updateWallet, Wallets} from "@/services/api";
import {LuPenSquare, LuSend} from "react-icons/lu";
import {addHours, format, parseISO} from "date-fns";
import Modal from '../../add/ui/modal';
import AddWalletForm from './AddWalletForm';

interface WalletProps {
    isEditing: boolean;
}

const Wallet: React.FC<WalletProps> = ({isEditing}) => {
    const [wallets, setWallets] = useState<Wallets[]>([]);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingWallet, setIsEditingWallet] = useState<{ [key: number]: boolean }>({});
    const [editableInitialBalance, setEditableInitialBalance] = useState<{ [key: number]: number }>({});
    const [editableDate, setEditableDate] = useState<{ [key: number]: string }>({});
    const [editableDescription, setEditableDescription] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const wallets = await getWallets();
                setWallets(wallets);
                const totalValue = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);
                setTotal(totalValue);
            } catch (error) {
                console.error('Failed to fetch wallets:', error);
            }
        };

        fetchWallets();
    }, []);

const handleEdit = (id: number, initial_balance: number, initial_date: string, description: string) => {
    setIsEditingWallet(prev => ({ ...prev, [id]: !prev[id] }));
    if (!isEditingWallet[id]) {
        setEditableInitialBalance(prev => ({ ...prev, [id]: initial_balance }));
        const parsedDate = parseISO(initial_date);
        const year = parsedDate.getUTCFullYear();
        const month = parsedDate.getUTCMonth() + 1;
        const day = parsedDate.getUTCDate();
        const dateWithNoTimezone = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        const date = format(dateWithNoTimezone, "yyyy-MM-dd")

        setEditableDate(prev => ({ ...prev, [id]: date }));
        setEditableDescription(prev => ({ ...prev, [id]: description }));
    }
};

    const handleSave = async (id: number) => {
        try {
            const initial_balance = editableInitialBalance[id];
            const initial_date = editableDate[id];
            const description = editableDescription[id];
            const [year, month, day] = initial_date.split('-').map(Number);
            const dateWithNoTimezone = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
            const date = format(dateWithNoTimezone, "yyyy-MM-dd'T'HH:mm:ssXXX")

            await updateWallet(id, initial_balance, date, description);
            const wallets = await getWallets();
            setWallets(wallets);
            const totalValue = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);
            setTotal(totalValue);
            setIsEditingWallet(prev => ({...prev, [id]: false}));
        } catch (error) {
            console.error('Failed to update wallet:', error);
        }
    };

    const handleAddWallet = async (name: string, initialBalance: number, initialDate: string) => {
        try {
            const [year, month, day] = initialDate.split('-').map(Number);
            const dateWithNoTimezone = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
            const date = format(dateWithNoTimezone, "yyyy-MM-dd'T'HH:mm:ssXXX");

            await addWallet(name, initialBalance, date);
            const wallets = await getWallets();
            setWallets(wallets);
            const totalValue = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);
            setTotal(totalValue);
        } catch (error) {
            console.error('Failed to add wallet:', error);
        }
        setIsModalOpen(false);
    };

    return (
        <div className={`${styles.container} ${isEditing ? styles.editing : ''}`}>
            <div className={styles.label}>Saldo total:</div>
            <div className={`${styles.value} ${styles.currency}`}>{total.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}</div>
            <div className={styles.list}>
                {wallets.map((wallet, index) => (
                    <div key={index} className={styles.listItem}>
        <span>
            {isEditingWallet[wallet.id] ? (
                <input
                    type="text"
                    value={editableDescription[wallet.id]}
                    className={styles.amountEdit}
                    onChange={(e) => setEditableDescription(prev => ({
                        ...prev,
                        [wallet.id]: e.target.value
                    }))}
                />
            ) : (
                wallet.description
            )}
        </span>
                        <span className={styles.value}>
            {wallet.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
                        {isEditing && (
                            <>
                                <div className={styles.editInfo}>
                    <span className={styles.value}>
                        {isEditingWallet[wallet.id] ? (
                            <input
                                type="number"
                                value={editableInitialBalance[wallet.id]}
                                className={styles.amountEdit}
                                onChange={(e) => setEditableInitialBalance(prev => ({
                                    ...prev,
                                    [wallet.id]: parseFloat(e.target.value)
                                }))}
                            />
                        ) : (
                            wallet.initial_balance.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })
                        )}
                    </span>
                                    <span className={styles.labelSmall}>Saldo inicial</span>
                                </div>
                                <div className={styles.editInfo}>
                    <span className={styles.value}>
                        {isEditingWallet[wallet.id] ? (
                            <input
                                type="date"
                                value={editableDate[wallet.id]}
                                className={styles.amountEdit}
                                onChange={(e) => setEditableDate(prev => ({
                                    ...prev,
                                    [wallet.id]: e.target.value
                                }))}
                            />
                        ) : (
                            format(addHours(new Date(wallet.initial_date), 12), 'dd-MM-yyyy')
                        )}
                    </span>
                                    <span className={styles.labelSmall}>Salvo em</span>
                                </div>
                                <button
                                    className={styles.buttonEdit}
                                    onClick={() => isEditingWallet[wallet.id] ? handleSave(wallet.id) : handleEdit(wallet.id, wallet.initial_balance, wallet.initial_date, wallet.description)}
                                >
                                    {isEditingWallet[wallet.id] ? <LuSend /> : <LuPenSquare />}
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
            {isEditing && (
                <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>Adicionar carteira</button>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddWalletForm onSubmit={handleAddWallet}/>
            </Modal>
        </div>
    );
};

export default Wallet;