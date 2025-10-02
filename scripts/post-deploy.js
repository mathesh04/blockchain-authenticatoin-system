const fs = require("fs");
const path = require("path");

// Read the deployment artifacts from Truffle
const buildPath = path.join(__dirname, "../build/contracts/AuthenticationSystem.json");

if (!fs.existsSync(buildPath)) {
  console.error("❌ Contract not found. Please run 'npm run compile' first.");
  process.exit(1);
}

// Read the Truffle deployment info
const contractArtifact = JSON.parse(fs.readFileSync(buildPath, "utf8"));

// Try to read from truffle migration artifacts
const migrationPath = path.join(__dirname, "../build/contracts/AuthenticationSystem.json");
if (fs.existsSync(migrationPath)) {
  const artifact = JSON.parse(fs.readFileSync(migrationPath, "utf8"));
  
  if (artifact.networks && artifact.networks["1337"]) {
    const contractAddress = artifact.networks["1337"].address;
    
    if (contractAddress) {
      // Create .env.local file
      const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
      const envPath = path.join(__dirname, "../.env.local");
      fs.writeFileSync(envPath, envContent);

      console.log("✅ Environment file (.env.local) created");
      console.log(`📍 Contract address: ${contractAddress}`);
      
      // Create deployment info
      const deploymentInfo = {
        contractAddress: contractAddress,
        deployedAt: new Date().toISOString(),
        network: "localhost:8545",
        networkId: "1337"
      };

      const deploymentPath = path.join(__dirname, "../deployment.json");
      fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
      console.log("📄 Deployment info saved to deployment.json");
      
      console.log("\n🎉 Setup completed successfully!");
      console.log("📋 Next steps:");
      console.log("1. Start the frontend: npm run dev");
      console.log("2. Open http://localhost:3000");
      console.log("3. Connect your MetaMask wallet");
      console.log("4. Make sure MetaMask is connected to localhost:8545");
      
      process.exit(0);
    }
  }
}

console.log("⚠️  Contract address not found in artifacts.");
console.log("Please check that the deployment was successful.");
console.log("You can manually set the contract address in .env.local file:");
console.log("NEXT_PUBLIC_CONTRACT_ADDRESS=<your-contract-address>");
