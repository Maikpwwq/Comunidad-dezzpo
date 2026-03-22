import SendbirdChat from '@sendbird/chat'
import { GroupChannelModule } from '@sendbird/chat/groupChannel'
import type { GroupChannelCreateParams } from '@sendbird/chat/groupChannel'
import { OpenChannelModule } from '@sendbird/chat/openChannel'
import { getDraft, updateDraft } from '@services/drafts'
// Need to import contracts if the user implements Phase 2 of this backend logic.
// import { getContract, updateContract } from '@services/contracts'

const appId = import.meta.env.VITE_APP_SENDBIRD_APPID
const MODERATOR_ID = import.meta.env.VITE_APP_SENDBIRD_MODERATOR_ID

let sbInstance: SendbirdChat | null = null

/**
 * Initializes the Sendbird Chat SDK singleton.
 */
export const getSendbirdInstance = (): SendbirdChat | null => {
    if (!sbInstance && appId) {
        sbInstance = SendbirdChat.init({
            appId,
            modules: [new GroupChannelModule(), new OpenChannelModule()],
        })
    }
    return sbInstance
}

/**
 * Ensures the Current User is authenticated with Sendbird.
 */
const ensureConnection = async (userId: string) => {
    const sb = getSendbirdInstance()
    if (!sb) throw new Error('Sendbird SDK not initialized.')
    
    // If already connected as the right user, we are good.
    if (sb.currentUser && sb.currentUser.userId === userId) {
        return sb
    }

    try {
        await sb.connect(userId)
        return sb
    } catch (error) {
        console.error('Failed to connect to Sendbird.', error)
        throw new Error('No se pudo conectar al sistema de mensajería. Comprueba tu conexión o registro.')
    }
}

/**
 * Syncs the current user's profile with Sendbird (nickname and avatar)
 */
export const syncSendbirdUser = async (userId: string, nickname: string, profileUrl?: string) => {
    try {
        const sb = await ensureConnection(userId)
        await sb.updateCurrentUserInfo({
            nickname: nickname || 'Usuario',
            profileUrl: profileUrl || ''
        })
    } catch (error) {
        console.error('Error syncing user profile to Sendbird:', error)
    }
}

/**
 * Gets or dynamically creates a programmatic Draft Negotiation Channel.
 * Syncs the channel_url to the Drafts Firestore Collection.
 */
export const getOrCreateDraftChannel = async (
    draftId: string, 
    proponentId: string, 
    ownerId: string
): Promise<string> => {
    // 1. Check if the draft already has a channel assigned
    const draft = await getDraft({ draftId })
    if (!draft) throw new Error('Requerimiento no encontrado')
        
    if (draft.channel_url) {
        return draft.channel_url
    }

    // 2. Connect the proponent (active user) to Sendbird to create it
    const sb = await ensureConnection(proponentId)

    // 3. Create the Channel
    const params: GroupChannelCreateParams = {
        invitedUserIds: [proponentId, ownerId, MODERATOR_ID],
        isDistinct: false,
        customType: 'draft_negotiation',
        name: draft.draftName || `Negociación ${draftId.substring(0, 6)}`,
        data: JSON.stringify({
            type: 'draft',
            draftId,
            title: draft.draftName || 'Sin título'
        })
    }

    try {
        const channel = await (sb as any).groupChannel.createChannel(params)
        
        // 4. Sync the Firestore Draft Document
        await updateDraft({
            draftId,
            data: { channel_url: channel.url }
        })

        return channel.url
    } catch (error) {
        console.error('Error creating Draft Channel:', error)
        throw new Error('Hubo un problema al crear el hilo de conversación confidencial.')
    }
}

/**
 * Gets or dynamically creates a programmatic Contract Execution Channel.
 * Syncs the channel_url to the Contracts Firestore Collection.
 */
export const getOrCreateContractChannel = async (
    contractId: string, 
    providerId: string, 
    clientId: string,
    contractTitle?: string
): Promise<string> => {
    // Similar to drafts, this would require getContract & updateContract
    // Mocking the structure for future implementation 
    /*
    const contract = await getContract(contractId)
    if (contract?.channel_url) return contract.channel_url
    */

    const sb = await ensureConnection(providerId)

    const params: GroupChannelCreateParams = {
        invitedUserIds: [providerId, clientId, MODERATOR_ID],
        isDistinct: false,
        customType: 'contract_execution',
        name: contractTitle || `Contrato ${contractId.substring(0, 6)}`,
        data: JSON.stringify({
            type: 'contract',
            contractId,
            title: contractTitle || 'Negocio Cerrado'
        })
    }

    try {
        const channel = await (sb as any).groupChannel.createChannel(params)
        
        // await updateContract(contractId, { channel_url: channel.url })
        
        return channel.url
    } catch (error) {
        console.error('Error creating Contract Channel:', error)
        throw new Error('Hubo un problema al inicializar el chat del contrato.')
    }
}

/**
 * Gets or dynamically creates a programmatic Direct Message Channel.
 * Used for the "Cotizar" button on user profiles directly.
 */
export const getOrCreateDirectChannel = async (
    currentUserId: string,
    targetUserId: string,
    targetUserName: string
): Promise<string> => {
    const sb = await ensureConnection(currentUserId)

    const params: GroupChannelCreateParams = {
        invitedUserIds: [currentUserId, targetUserId, MODERATOR_ID],
        isDistinct: true, // Use distinct to reuse existing 1-on-1 channels
        customType: 'direct_quote',
        name: `Cotización Directa - ${targetUserName}`,
        data: JSON.stringify({
            type: 'direct',
            targetUserId,
            title: `Cotización con ${targetUserName}`
        })
    }

    try {
        const channel = await (sb as any).groupChannel.createChannel(params)
        return channel.url
    } catch (error) {
        console.error('Error creating Direct Channel:', error)
        throw new Error('Hubo un problema al inicializar el chat.')
    }
}

/**
 * Gets or dynamically creates a programmatic Open Channel for a Merchant's Profile.
 * Used for the comments section.
 */
export const createOpenChannelForUser = async (
    merchantId: string,
    merchantName: string
): Promise<string> => {
    // To bypass the need for an active Client SDK Session Token for the Moderator,
    // we use the Sendbird Platform API (Server-to-Server) to orchestrate channel creation natively.
    const apiToken = import.meta.env.VITE_APP_SENDBIRD_APPTOKEN
    const apiUrl = import.meta.env.VITE_APP_SENDBIRD_API_URL

    if (!apiToken || !apiUrl) {
        throw new Error('Faltan credenciales de la API de Sendbird en el entorno.')
    }

    const payload = {
        name: `Comentarios: ${merchantName}`,
        custom_type: 'profile_comment',
        operator_ids: [merchantId, MODERATOR_ID],
        data: JSON.stringify({
            type: 'profile',
            merchantId,
            title: `Comentarios de ${merchantName}`
        })
    }

    try {
        const response = await fetch(`${apiUrl}/v3/open_channels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json, charset=utf8',
                'Api-Token': apiToken
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const errData = await response.json()
            console.error('Sendbird API Error:', errData)
            throw new Error(`Error de API: ${errData.message}`)
        }

        const channelData = await response.json()
        return channelData.channel_url
    } catch (error) {
        console.error('Error creating Open Channel via Platform API:', error)
        throw new Error('Hubo un problema al crear el canal de comentarios abierto.')
    }
}
