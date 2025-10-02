import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

const MetaMaskContext = createContext();

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
};

export const MetaMaskProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Contract ABI and address (will be updated after deployment)
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
  const contractABI = [
    "function registerUser(string memory _username, string memory _email, string memory _publicKey) external",
    "function login() external",
    "function getUserInfo(address _userAddress) external view returns (tuple(string username, string email, uint256 registrationDate, bool isActive, uint256 lastLogin, string publicKey))",
    "function isUserActive(address _userAddress) external view returns (bool)",
    "function isRegistered(address _userAddress) external view returns (bool)",
    "function updateUserInfo(string memory _newUsername, string memory _newEmail, string memory _newPublicKey) external",
    "function deactivateUser(address _userAddress) external",
    "event UserRegistered(address indexed userAddress, string username, string email, uint256 timestamp)",
    "event UserLoggedIn(address indexed userAddress, uint256 timestamp)",
    "event UserUpdated(address indexed userAddress, string username, string email, uint256 timestamp)"
  ];

  // Initialize MetaMask connection
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const ethereumProvider = await detectEthereumProvider();
      
      if (!ethereumProvider) {
        throw new Error('MetaMask not found! Please install MetaMask extension.');
      }

      // Request account access
      const accounts = await ethereumProvider.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found!');
      }

      const account = accounts[0];
      const ethersProvider = new ethers.providers.Web3Provider(ethereumProvider);
      
      setAccount(account);
      setProvider(ethersProvider);
      setIsConnected(true);

      // Initialize contract
      if (contractAddress) {
        const signer = ethersProvider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);
        
        // Check if user is registered
        await checkUserRegistration(account, contractInstance);
      }

    } catch (err) {
      setError(err.message);
      console.error('Error connecting to MetaMask:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is registered
  const checkUserRegistration = async (userAddress, contractInstance) => {
    try {
      const isRegistered = await contractInstance.isRegistered(userAddress);
      if (isRegistered) {
        const userInfo = await contractInstance.getUserInfo(userAddress);
        setUserInfo({
          username: userInfo.username,
          email: userInfo.email,
          registrationDate: new Date(userInfo.registrationDate * 1000),
          isActive: userInfo.isActive,
          lastLogin: userInfo.lastLogin > 0 ? new Date(userInfo.lastLogin * 1000) : null,
          publicKey: userInfo.publicKey
        });
      }
    } catch (err) {
      console.error('Error checking user registration:', err);
    }
  };

  // Register new user
  const registerUser = async (username, email, publicKey = '') => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.registerUser(username, email, publicKey);
      await tx.wait();
      
      // Refresh user info
      await checkUserRegistration(account, contract);
      
      return tx;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const loginUser = async () => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.login();
      await tx.wait();
      
      // Refresh user info
      await checkUserRegistration(account, contract);
      
      return tx;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user info
  const updateUserInfo = async (newUsername = '', newEmail = '', newPublicKey = '') => {
    if (!contract) {
      throw new Error('Contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.updateUserInfo(newUsername, newEmail, newPublicKey);
      await tx.wait();
      
      // Refresh user info
      await checkUserRegistration(account, contract);
      
      return tx;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setIsConnected(false);
    setUserInfo(null);
    setError(null);
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const value = {
    account,
    provider,
    contract,
    isConnected,
    isLoading,
    error,
    userInfo,
    connectWallet,
    disconnectWallet,
    registerUser,
    loginUser,
    updateUserInfo,
    checkUserRegistration
  };

  return (
    <MetaMaskContext.Provider value={value}>
      {children}
    </MetaMaskContext.Provider>
  );
};
