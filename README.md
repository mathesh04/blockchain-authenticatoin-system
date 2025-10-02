Blockchain Authentication System

A secure, decentralized authentication system built on the Ethereum blockchain that replaces traditional username-password authentication with wallet-based authentication.

## 🎯 Problem Statement

This project addresses the increasing risk of using the same credentials (username-password) everywhere or linking one account with every service. The solution provides:

- **Secure Authentication**: Uses Ethereum wallet addresses as unique identifiers
- **No Password Storage**: Eliminates the need for storing passwords on servers
- **Decentralized Identity**: User identity is managed on the blockchain
- **Browser Integration**: Works seamlessly with MetaMask and other Web3 wallets

## 🚀 Features

- **Wallet-based Authentication**: Connect with MetaMask or any Web3 wallet
- **User Registration**: Register on the blockchain with username and email
- **Secure Login**: Sign transactions to authenticate
- **Profile Management**: Update user information securely
- **Modern UI**: Beautiful, responsive interface with blockchain theme
- **Real-time Updates**: Live blockchain transaction status

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity**: Smart contract development
- **OpenZeppelin**: Security libraries and contracts
- **Truffle**: Development framework and testing

### Frontend
- **Next.js**: React framework for the web application
- **Ethers.js**: Ethereum library for blockchain interaction
- **MetaMask**: Wallet integration
- **CSS Modules**: Styled components

### Blockchain
- **Ethereum**: Blockchain platform
- **Ganache**: Local blockchain for development
- **Web3.js**: Blockchain interaction library

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MetaMask** browser extension
- **Ganache** (for local development)


## 🔧 Usage

### 1. Connect Wallet
- Click "Connect MetaMask" button
- Approve the connection in MetaMask
- Ensure you're connected to the correct network (localhost:8545 for development)

### 2. Register Account
- If you're not registered, click "Register Account"
- Fill in your username and email
- Submit the transaction and approve in MetaMask

### 3. Login
- Click "Login" to authenticate
- Approve the transaction in MetaMask
- Your login timestamp will be updated on the blockchain

### 4. Update Profile
- Click "Update Profile" to modify your information
- Leave fields empty to keep current values
- Submit changes and approve in MetaMask



## 🔒 Smart Contract Features

### AuthenticationSystem.sol

- **User Registration**: Register with username, email, and optional public key
- **Login Tracking**: Record login timestamps on the blockchain
- **Profile Updates**: Modify user information securely
- **Account Management**: Deactivate/reactivate accounts
- **Security**: Reentrancy protection and access controls

### Key Functions

- `registerUser()`: Register new user
- `login()`: Authenticate user
- `updateUserInfo()`: Update profile information
- `getUserInfo()`: Retrieve user data
- `isUserActive()`: Check account status


## 🔐 Security Considerations

- **Private Key Security**: Never expose private keys
- **Network Security**: Use HTTPS in production
- **Contract Security**: Audited smart contracts
- **Input Validation**: Client and contract-side validation
- **Access Controls**: Proper permission management


