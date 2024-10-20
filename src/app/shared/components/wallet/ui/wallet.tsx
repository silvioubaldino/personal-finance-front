'use client';

import React, { useEffect, useState } from 'react';
import styles from '../styles/wallet.module.css';
import {getWallets, Wallets} from "@/services/api";

const SaldoTotal = () => {
    const [wallets, setWallets] = useState<Wallets[]>([]);
    const [total, setTotal] = useState(0);

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

    return (
        <div className={styles.container}>
            <div className={styles.label}>Saldo total:</div>
            <div className={styles.value}>{total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
            <div className={styles.list}>
                {wallets.map((item, index) => (
                    <div key={index} className={styles.listItem}>
                        <span>{item.description}:</span>
                        <span>{item.balance.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SaldoTotal;