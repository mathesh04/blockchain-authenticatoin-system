const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function deployContract() {
  try {
    console.log("🚀 Starting contract deployment...");

    // Read the compiled contract
    const contractPath = path.join(__dirname, "../build/contracts/AuthenticationSystem.json");
    
    if (!fs.existsSync(contractPath)) {
      console.error("❌ Contract not compiled. Please run 'npm run compile' first.");
      process.exit(1);
    }

    const contractArtifact = JSON.parse(fs.readFileSync(contractPath, "utf8"));

    // Connect to local blockchain (Ganache)
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
    
    // Get the first account as deployer
    const accounts = await provider.listAccounts();
    if (accounts.length === 0) {
      console.error("❌ No accounts found. Please start Ganache first.");
      process.exit(1);
    }

    const deployer = accounts[0];
    console.log(`📝 Deploying from account: ${deployer}`);

    // Get the private key for the deployer account
    // In Ganache, we need to get the private key from the accounts
    const privateKey = process.env.PRIVATE_KEY || "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"; // Default Ganache private key
    
    // Create wallet instance
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Create contract factory
    const contractFactory = new ethers.ContractFactory(
      contractArtifact.abi,
      contractArtifact.bytecode,
      wallet
    );

    // Deploy the contract
    console.log("⏳ Deploying AuthenticationSystem contract...");
    const contract = await contractFactory.deploy();
    
    console.log("⏳ Waiting for deployment confirmation...");
    await contract.deployed();

    console.log("✅ Contract deployed successfully!");
    console.log(`📍 Contract address: ${contract.address}`);
    console.log(`🔗 Transaction hash: ${contract.deployTransaction.hash}`);

    // Save deployment info
    const deploymentInfo = {
      contractAddress: contract.address,
      deployer: deployer,
      transactionHash: contract.deployTransaction.hash,
      deployedAt: new Date().toISOString(),
      network: "localhost:8545"
    };

    const deploymentPath = path.join(__dirname, "../deployment.json");
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

    console.log("📄 Deployment info saved to deployment.json");

    // Create .env.local file
    const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contract.address}\n`;
    const envPath = path.join(__dirname, "../.env.local");
    fs.writeFileSync(envPath, envContent);

    console.log("🔧 Environment file (.env.local) created");

    console.log("\n🎉 Deployment completed successfully!");
    console.log("📋 Next steps:");
    console.log("1. Start the frontend: npm run dev");
    console.log("2. Open http://localhost:3000");
    console.log("3. Connect your MetaMask wallet");
    console.log("4. Make sure MetaMask is connected to localhost:8545");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

// Run deployment if this script is executed directly
if (require.main === module) {
  deployContract();
}

module.exports = { deployContract };
