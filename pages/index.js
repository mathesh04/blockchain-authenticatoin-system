import { useState } from 'react';
import { useMetaMask } from '../contexts/MetaMaskContext';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const {
    account,
    isConnected,
    isLoading,
    error,
    userInfo,
    connectWallet,
    disconnectWallet,
    registerUser,
    loginUser,
    updateUserInfo
  } = useMetaMask();

  const [showRegistration, setShowRegistration] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    publicKey: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData.username, formData.email, formData.publicKey);
      setShowRegistration(false);
      setFormData({ username: '', email: '', publicKey: '' });
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleLogin = async () => {
    try {
      await loginUser();
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserInfo(formData.username, formData.email, formData.publicKey);
      setShowUpdate(false);
      setFormData({ username: '', email: '', publicKey: '' });
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Blockchain Authentication System</title>
        <meta name="description" content="Secure blockchain-based authentication using Ethereum" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            🔐 Blockchain Authentication System
          </h1>
          <p className={styles.description}>
            Secure authentication powered by Ethereum blockchain
          </p>
        </div>

        <div className={styles.content}>
          {!isConnected ? (
            <div className={styles.connectSection}>
              <div className={styles.card}>
                <h2>Connect Your Wallet</h2>
                <p>Connect your MetaMask wallet to get started with blockchain authentication</p>
                <button 
                  className={styles.connectButton}
                  onClick={connectWallet}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Connect MetaMask'}
                </button>
                {error && <p className={styles.error}>{error}</p>}
              </div>
            </div>
          ) : (
            <div className={styles.dashboard}>
              <div className={styles.walletInfo}>
                <h2>Wallet Connected</h2>
                <p className={styles.address}>
                  Address: {account}
                </p>
                <button 
                  className={styles.disconnectButton}
                  onClick={disconnectWallet}
                >
                  Disconnect
                </button>
              </div>

              {!userInfo ? (
                <div className={styles.registrationSection}>
                  <div className={styles.card}>
                    <h2>Welcome! You're not registered yet.</h2>
                    <p>Register your account on the blockchain to get started</p>
                    <button 
                      className={styles.primaryButton}
                      onClick={() => setShowRegistration(true)}
                    >
                      Register Account
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.userSection}>
                  <div className={styles.card}>
                    <h2>Welcome, {userInfo.username}!</h2>
                    <div className={styles.userInfo}>
                      <p><strong>Email:</strong> {userInfo.email}</p>
                      <p><strong>Registration Date:</strong> {userInfo.registrationDate.toLocaleDateString()}</p>
                      <p><strong>Last Login:</strong> {userInfo.lastLogin ? userInfo.lastLogin.toLocaleString() : 'Never'}</p>
                      <p><strong>Status:</strong> {userInfo.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                    <div className={styles.actions}>
                      <button 
                        className={styles.primaryButton}
                        onClick={handleLogin}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Logging in...' : 'Login'}
                      </button>
                      <button 
                        className={styles.secondaryButton}
                        onClick={() => setShowUpdate(true)}
                      >
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Registration Modal */}
        {showRegistration && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Register Account</h2>
              <form onSubmit={handleRegister}>
                <div className={styles.formGroup}>
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Public Key (optional):</label>
                  <input
                    type="text"
                    name="publicKey"
                    value={formData.publicKey}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.primaryButton} disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                  <button 
                    type="button" 
                    className={styles.secondaryButton}
                    onClick={() => setShowRegistration(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {showUpdate && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Update Profile</h2>
              <form onSubmit={handleUpdate}>
                <div className={styles.formGroup}>
                  <label>New Username (leave empty to keep current):</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={userInfo?.username}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>New Email (leave empty to keep current):</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={userInfo?.email}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>New Public Key (leave empty to keep current):</label>
                  <input
                    type="text"
                    name="publicKey"
                    value={formData.publicKey}
                    onChange={handleInputChange}
                    placeholder={userInfo?.publicKey}
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.primaryButton} disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update'}
                  </button>
                  <button 
                    type="button" 
                    className={styles.secondaryButton}
                    onClick={() => setShowUpdate(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Blockchain Authentication System - Powered by Ethereum</p>
      </footer>
    </div>
  );
}
