'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from '../styles/logout-button.module.css';
import {LuLogOut} from "react-icons/lu";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('user_token');
    router.push('/login');
  };

  return (
    <button className={styles.logoutButton} onClick={handleLogout}>
      <LuLogOut/>
    </button>
  );
};

export default LogoutButton;