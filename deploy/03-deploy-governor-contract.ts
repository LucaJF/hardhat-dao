import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { networkcConfig, VOTING_PERIOD, VOTING_DELAY, QUORUN_PERCENTAGE } from '../helper-hardhat-config';

const deployGovernorContract: DeployFunction = async ({ getNamedAccounts, deployments, network }: HardhatRuntimeEnvironment) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await get("GovernanceToken")
    const timeLock = await get("TimeLock")

    log("Deploying Governor...")

    const args: any[] = [
        governanceToken.address, 
        timeLock.address, 
        VOTING_DELAY,
        VOTING_PERIOD,
        QUORUN_PERCENTAGE
    ]
    const governorContract = await deploy("GovernorContract", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: networkcConfig[network.name].blockConfirmations || 1
    })

    log("---------------------------------------------------")
}

deployGovernorContract.tags = ["all", "governor"]
export default deployGovernorContract