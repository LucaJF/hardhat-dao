import { ethers, network } from "hardhat";
import { mine } from "@nomicfoundation/hardhat-network-helpers"
import { VOTING_PERIOD, developmentChains, proposalsFile } from '../helper-hardhat-config';
import { readFileSync } from "fs"

export async function main(proposalIndex: number) {
    const proposals = JSON.parse(readFileSync(proposalsFile, "utf8"))
    const proposalId = proposals[network.config.chainId!.toString()][proposalIndex]
    const governor = await ethers.getContract("GovernorContract")
    // 0 = Against, 1 = For, 2 = Abstain
    const voteWay = 1  // support
    const reason = "I like like."
    const voteTxRes = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTxRes.wait(1)

    if (developmentChains.includes(network.name)) {
        await mine(VOTING_PERIOD)
    } 

    console.log("Voted! Ready to go!");
}

main(0)
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e)
        process.exit(1)
    })