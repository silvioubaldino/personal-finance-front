'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '@/services/authentication/firebase';
import GoogleLoginButton from './ui/GoogleLoginButton';
import styles from './styles/login.module.css';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      Cookies.set('user_token', token, { expires: 1 });

      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      setError('Falha no login. Verifique suas credenciais.');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      Cookies.set('user_token', token, { expires: 1 });

      router.push('/dashboard');
    } catch (error) {
      console.log(error);
      setError('Falha no login com Google.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.loginButton}>Login</button>
        </form>
        <div className={styles.googleButton}>
          <GoogleLoginButton onClick={handleGoogleLogin} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;