export interface networkConfigItem {
    ethUsdPriceFeed?: string
    blockConfirmations?: number
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem
}

export const networkcConfig: networkConfigInfo = {
    localhost: {},
    hardhat: {},
    goerli: {
        blockConfirmations: 6
    }
}

export const developmentChains = ["hardhat", "localhost"]

export const NEW_STORE_VALUE = 77
export const FUNC_NAME = "store"
export const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in the Box!"

export const MIN_DELAY = 3600
export const VOTING_PERIOD = 5
export const VOTING_DELAY = 1
export const QUORUN_PERCENTAGE = 4

export const proposalsFile = "proposals.json"