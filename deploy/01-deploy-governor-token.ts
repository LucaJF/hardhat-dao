import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { ethers } from "hardhat";
import { networkcConfig } from '../helper-hardhat-config';

const deployGovernanceToken: DeployFunction = async function ({ getNamedAccounts, deployments, network }: HardhatRuntimeEnvironment) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying Governance Token...");
    
    const governanceToken = await deploy ("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: networkcConfig[network.name].blockConfirmations || 1
    });

    log(`Deployed governance token to address: ${governanceToken.address}`);

    await delegate(governanceToken.address, deployer);
    log("Delegated!");
    
    log("---------------------------------------------------")
}

const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress);
    const tx = await governanceToken.delegate(delegatedAccount);
    await tx.wait(1);
    console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`);
}

deployGovernanceToken.tags = ["all", "token"]
export default deployGovernanceToken;