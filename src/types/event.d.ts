import {SingleChannelType} from "@/types/channel";

export type FormattedFinishDateType = {
    date: string,
    time: string,
    timeRemaining: string,
    isFinished: boolean,
    isEnding: boolean
}

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
    updatedAt: string,
    formattedFinishDate?: FormattedFinishDateType
}

export type CreateOrUpdateEventType = {
    name?: string
    descr?: string,
    image?: any,
    imageUrl?: string,
    imageId?: string,
    imageName?: string,
    finishDate?: any,
    isActive?: boolean,
    subscribeChannels?: string[],
    sentChannels: string[]
}