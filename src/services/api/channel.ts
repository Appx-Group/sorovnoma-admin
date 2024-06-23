/* eslint-disable @typescript-eslint/no-explicit-any */
import {api} from "../configs";
import {CreateOrUpdateChannelType} from "@/types/channel";

class Channel {
    getChannels = async (keyword?: string) => {
        return await api.get("/channel", {
            params: {
                keyword: keyword || undefined
            }
        });
    }
    create = async (data: CreateOrUpdateChannelType) => {
        return await api.post("/channel", data)
    }
    update = async (id: string, data: CreateOrUpdateChannelType) => {
        return await api.put(`/channel/${id}`, data)
    }
    delete = async (id: string) => {
        return await api.delete(`/channel/${id}`);
    }
}

export const channelService = new Channel();
