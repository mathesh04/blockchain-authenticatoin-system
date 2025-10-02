# 🚀 Quick Setup Guide

This guide will help you set up and run the Blockchain Authentication System in minutes.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension
3. **Git** (optional)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Local Blockchain

Open a new terminal and run:

```bash
npm run start:local
```

This starts Ganache on `localhost:8545`. Keep this terminal running.

### 3. Deploy Smart Contracts

In another terminal, run:

```bash
npm run setup
```

This will:
- Compile the smart contracts
- Deploy them to your local blockchain
- Create the necessary environment files

### 4. Start the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Configure MetaMask

1. Open MetaMask
2. Add a new network:
   - **Network Name**: Localhost 8545
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH

3. Import one of the Ganache accounts:
   - Copy a private key from the Ganache terminal
   - In MetaMask: Account → Import Account → Paste the private key

## 🎯 Testing the System

1. **Connect Wallet**: Click "Connect MetaMask" and approve the connection
2. **Register**: If you're not registered, click "Register Account" and fill in your details
3. **Login**: Click "Login" to authenticate
4. **Update Profile**: Try updating your profile information

## 🔧 Troubleshooting

### MetaMask Connection Issues
- Make sure MetaMask is connected to `localhost:8545`
- Check that you have imported a Ganache account
- Try refreshing the page

### Contract Deployment Issues
- Ensure Ganache is running on port 8545
- Check that you have accounts with ETH balance
- Try running `npm run compile` first, then `npm run deploy:local`

### Frontend Issues
- Clear browser cache
- Check browser console for errors
- Ensure all dependencies are installed

## 📁 Project Structure

```
blockchain-authentication-system/
├── contracts/           # Smart contracts
├── pages/              # Next.js pages
├── contexts/           # React contexts
├── styles/             # CSS styles
├── scripts/            # Deployment scripts
├── test/               # Test files
└── README.md           # Full documentation
```

## 🎉 You're Ready!

Your blockchain authentication system is now running! 

- **Frontend**: http://localhost:3000
- **Blockchain**: localhost:8545
- **Contract**: Automatically deployed and configured

## 🔗 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the smart contract code in `contracts/AuthenticationSystem.sol`
- Check out the test files in `test/` directory
- Customize the UI in `styles/` directory

---

**Need help?** Check the [README.md](README.md) for comprehensive documentation.
