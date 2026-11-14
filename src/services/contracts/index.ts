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
