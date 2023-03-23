import { ethers, network } from "hardhat";
import { mine } from "@nomicfoundation/hardhat-network-helpers"
import { NEW_STORE_VALUE, FUNC_NAME, PROPOSAL_DESCRIPTION, VOTING_DELAY, developmentChains, proposalsFile } from '../helper-hardhat-config';
import { readFileSync, writeFileSync } from "fs"

export async function main(functionToCall: string, args: any[], proposalDescription: string) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
    
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
    console.log(`Proposal Description: \n ${proposalDescription}`);
    
    const proposeTx = await governor.propose([box.address], [0], [encodedFunctionCall], proposalDescription)
    const proposeReceipt = await proposeTx.wait(1)

    if (developmentChains.includes(network.name)) {
        await mine(VOTING_DELAY + 1)
    }

    const proposalId = proposeReceipt.events[0].args.proposalId
    const proposals = JSON.parse(readFileSync(proposalsFile, "utf8"))
    const chainId = network.config.chainId!.toString()
    !proposals[chainId] && (proposals[chainId] = [])
    proposals[chainId].push(proposalId.toString())
    writeFileSync(proposalsFile, JSON.stringify(proposals))
}

main(FUNC_NAME, [NEW_STORE_VALUE], PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e)
        process.exit(1)
    })