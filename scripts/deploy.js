const hre = require("hardhat");

async function main() {
  const FileStorage = await hre.ethers.getContractFactory("FileStorage");
  const fileStorage = await FileStorage.deploy();

  await fileStorage.deployed();

  console.log("FileStorage deployed to:", fileStorage.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
