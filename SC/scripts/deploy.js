const hre = require("hardhat");
const path = require('path');
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const faucet = await hre.ethers.getContractFactory("faucet");
  const faucetContract = await faucet.deploy();

  console.log("Faucet contract deployed to:",await faucetContract.getAddress());
  await saveFrontendFiles(faucetContract)

}

async function saveFrontendFiles(token) {
  const fs = require("fs");
  console.log(__dirname + '..')
  const contractsDir = path.join(__dirname,'..', '..', 'FE','src', 'contracts');
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Token: await token.getAddress() }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("faucet");

  fs.writeFileSync(
    path.join(contractsDir, "faucet.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });