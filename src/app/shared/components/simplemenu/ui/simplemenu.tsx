import React from 'react';
import Link from 'next/link';
import styles from '../styles/simplemenu.module.css';
import LogoutButton from "@/app/shared/components/logout/ui/logout-button";

const SimpleMenu = () => {
    return (
        <div className={styles.menuContainer}>
            <div className={styles.menuHeader}>
                <h3>Bem vindo(a)...</h3>
                <LogoutButton />
            </div>
            <ul className={styles.menuList}>
                <li className={styles.menuItem}>
                    <Link href="/dashboard" className={styles.menuLink}>Início</Link>
                </li>
                <li className={styles.menuItem}>
                    <Link href="/estimates" className={styles.menuLink}>Planejamento</Link>
                </li>
                <li className={styles.menuItem}>
                    <Link href="/wallets" className={styles.menuLink}>Carteiras</Link>
                </li>
                <li className={styles.menuItem}>
                    <Link href="/categories" className={styles.menuLink}>Categorias</Link>
                </li>
            </ul>
        </div>
    );
};

export default SimpleMenu;