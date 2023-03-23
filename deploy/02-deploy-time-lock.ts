import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { networkcConfig, MIN_DELAY } from "../helper-hardhat-config"

const deployTimeLock: DeployFunction = async ({ getNamedAccounts, deployments, network }: HardhatRuntimeEnvironment) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("Deploying Timelock...")

    const args: any[] = [MIN_DELAY, [], []]
    const timeLock = await deploy("TimeLock", {
        from: deployer,
        log: true,
        args,
        waitConfirmations: networkcConfig[network.name].blockConfirmations || 1
    })

    log("---------------------------------------------------")
}

deployTimeLock.tags = ["all", "timelock"]
export default deployTimeLock