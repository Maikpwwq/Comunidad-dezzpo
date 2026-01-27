/**
 * Sendbird Channel Service
 *
 * TypeScript wrapper for Sendbird channel operations using ServiceResponse<T> pattern.
 * Note: Actual Sendbird SDK operations are passed in from UIKit hooks,
 * this service provides type-safe wrappers.
 */

import type { ServiceResponse, CreateChannelParams, ChannelResponse } from '@/types/services.d'

/**
 * Sendbird SDK interface (passed from UIKit context)
 */
interface SendbirdSDK {
    OpenChannelParams?: new () => OpenChannelParams
    GroupChannelParams?: new () => GroupChannelParams
}

interface OpenChannelParams {
    name: (name: string) => void
    channelUrl: (url: string) => void
    customType: (type: string) => void
    data: (data: string) => void
    operatorUserIds?: (ids: string[]) => void
}

interface GroupChannelParams {
    addUserIds: (ids: string[]) => void
    name: (name: string) => void
    customType: (type: string) => void
}

interface ChannelResult {
    url: string
    name: string
    coverUrl?: string
    members?: unknown[]
    createdAt?: number
}

type ConnectFunction = (userId: string, accessToken?: string) => Promise<unknown>
type CreateChannelFunction = (params: OpenChannelParams) => Promise<ChannelResult>

/**
 * Transform display name to URL-safe format
 */
function transformToUrlSafe(displayName: string): string {
    return displayName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(' ')
        .join('_')
}

/**
 * Connect user to Sendbird
 */
export async function connectUser(
    connect: ConnectFunction,
    userId: string,
    accessToken?: string
): Promise<ServiceResponse<void>> {
    try {
        if (typeof connect !== 'function') {
            return {
                success: false,
                data: null,
                error: { code: 'SENDBIRD_CHANNEL_ERROR', message: 'Sendbird SDK connect not available' },
            }
        }

        await connect(userId, accessToken)
        return { success: true, data: undefined, error: null }
    } catch (error) {
        return {
            success: false,
            data: null,
            error: {
                code: 'SENDBIRD_CHANNEL_ERROR',
                message: (error as Error).message ?? 'Failed to connect to Sendbird',
            },
        }
    }
}

/**
 * Create an open channel for a professional profile
 */
export async function createOpenChannel(
    sdk: SendbirdSDK,
    createChannel: CreateChannelFunction,
    params: CreateChannelParams
): Promise<ServiceResponse<ChannelResponse>> {
    try {
        if (typeof createChannel !== 'function' || !sdk?.OpenChannelParams) {
            return {
                success: false,
                data: null,
                error: { code: 'SENDBIRD_CHANNEL_ERROR', message: 'Sendbird SDK not available' },
            }
        }

        const urlSafeName = transformToUrlSafe(params.channelName)
        const channelParams = new sdk.OpenChannelParams()
        channelParams.name(params.channelName)
        channelParams.channelUrl(`sendbird_open_channel_${urlSafeName}`)
        channelParams.customType(params.customType ?? 'profesional calificado')
        channelParams.data(params.data ?? `Canal perfil profesional ${params.channelName}`)

        if (params.operatorIds && channelParams.operatorUserIds) {
            channelParams.operatorUserIds(params.operatorIds)
        }

        const channel = await createChannel(channelParams)

        return {
            success: true,
            error: null,
            data: {
                channelUrl: channel.url,
                name: channel.name,
                createdAt: channel.createdAt ?? Date.now(),
                memberCount: channel.members?.length ?? 0,
            },
        }
    } catch (error) {
        return {
            success: false,
            data: null,
            error: {
                code: 'SENDBIRD_CHANNEL_ERROR',
                message: (error as Error).message ?? 'Failed to create channel',
            },
        }
    }
}

/**
 * Get channel URL from channel name
 */
export function getChannelUrl(channelName: string): string {
    return `sendbird_open_channel_${transformToUrlSafe(channelName)}`
}
