# 🔐 Blockchain Authentication System

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

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blockchain-authentication-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Local Blockchain

Install and start Ganache:

```bash
# Install Ganache globally
npm install -g ganache-cli

# Start Ganache
ganache-cli
```

Or download Ganache Desktop from [https://trufflesuite.com/ganache/](https://trufflesuite.com/ganache/)

### 4. Deploy Smart Contracts

```bash
# Compile contracts
npm run compile

# Deploy to local blockchain
npm run deploy
```

### 5. Configure Environment

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-contract-address>
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

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

## 📁 Project Structure

```
blockchain-authentication-system/
├── contracts/
│   └── AuthenticationSystem.sol    # Main smart contract
├── migrations/
│   └── 1_deploy_authentication.js  # Contract deployment
├── pages/
│   ├── _app.js                     # App wrapper with providers
│   └── index.js                    # Main homepage
├── contexts/
│   └── MetaMaskContext.js          # MetaMask integration
├── styles/
│   ├── globals.css                 # Global styles
│   └── Home.module.css             # Component styles
├── truffle-config.js               # Truffle configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # Project documentation
```

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

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

## 🚀 Deployment

### Local Development
1. Start Ganache
2. Deploy contracts: `npm run deploy`
3. Update `.env.local` with contract address
4. Start frontend: `npm run dev`

### Production Deployment
1. Deploy contracts to Ethereum mainnet/testnet
2. Update environment variables
3. Build and deploy frontend

## 🔐 Security Considerations

- **Private Key Security**: Never expose private keys
- **Network Security**: Use HTTPS in production
- **Contract Security**: Audited smart contracts
- **Input Validation**: Client and contract-side validation
- **Access Controls**: Proper permission management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the smart contract code

## 🔮 Future Enhancements

- **Multi-chain Support**: Support for other blockchains
- **Social Login**: Integration with social platforms
- **Two-Factor Authentication**: Additional security layers
- **Mobile App**: Native mobile application
- **API Integration**: REST API for third-party integration

---

**Built with ❤️ for secure, decentralized authentication**
