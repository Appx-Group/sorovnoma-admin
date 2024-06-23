import {SingleChannelType} from "@/types/channel";

export type SingleEventType = {
    id: number,
    name: string,
    descr: string,
    imageName: string,
    imageUrl: string,
    imageId: string,
    finishDate: Date,
    isActive: boolean,
    subscribeChannels: SingleChannelType[],
    sentChannels: SingleChannelType[]
    createdAt: string,
    updatedAt: string
}

export type CreateOrUpdateEventType = {
    name?: string
    descr?: string,
    image?: any,
    finishDate?: any,
    subscribeChannels?: string[],
    sentChannels: string[]
}