import { ethers, run, network } from "hardhat";

async function main() {
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();

  await simpleStorage.deployed();

  // Verify contract on Etherscan
  // We only verify on a testnet!
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    // 6 blocks is sort of a guess
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }

  console.log(
    `Deployed to ${simpleStorage.address} on network ${network.name} with ${network.config.chainId} chainId`
  );
}

const verify = async (contractAddress: string, args: any[]) => {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  }
  catch ( error: any ) {
    if ( error?.message?.toLowerCase().includes('Contract source code already verified') ) {
      console.log('Contract source code already verified');
      return;
    }
    console.log(error);
  }
};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
