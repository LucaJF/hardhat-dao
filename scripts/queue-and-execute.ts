import { ethers, network } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers"
import { NEW_STORE_VALUE, FUNC_NAME, PROPOSAL_DESCRIPTION, MIN_DELAY, developmentChains } from '../helper-hardhat-config';

export async function main() {
    const box = await ethers.getContract("Box")
    const governor = await ethers.getContract("GovernorContract")
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC_NAME, [NEW_STORE_VALUE])
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))

    console.log("Queueing...");

    const queueTx = await governor.queue([box.address], [0], [encodedFunctionCall], descriptionHash)
    await queueTx.wait(1)
    
    if (developmentChains.includes(network.name)) {
        await time.increase(MIN_DELAY + 1)
    } 

    console.log("Executing...");

    const executeTx = await governor.execute([box.address], [0], [encodedFunctionCall], descriptionHash)
    await executeTx.wait(1)
    
    const boxNewValue = await box.retrieve()
    console.log(`New Box Value: ${boxNewValue.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e)
        process.exit(1)
    })