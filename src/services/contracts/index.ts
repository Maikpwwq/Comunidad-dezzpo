/**
 * Contracts Service Index
 */

export {
    createContract,
    getContract,
    updateContract,
    getContractsByClient,
    getContractsByProvider,
    getCompletedContracts,
} from './contractService'

export {
    validateMilestonesPercentages,
    calculateMilestoneProgress,
    createContractMilestones,
    getMilestonesByContract,
    submitMilestoneProof,
    approveMilestone,
    type ContractMilestone,
    type MilestoneStatus,
    type CreateMilestoneInput,
} from './milestoneService'

export {
    addDailyLog,
    getDailyLogsByContract,
    toggleDailyLogPublicShare,
    generateContractShareToken,
    verifyContractShareToken,
    type ContractDailyLog,
    type CreateDailyLogInput,
} from './dailyLogService'

export {
    generatePhB2bContract,
    type PhCommonAreaPartida,
    type PhContractParties,
    type PhContractTerms,
    type GeneratedPhContract,
} from './b2bPhContractService'

