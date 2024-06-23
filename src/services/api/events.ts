/* eslint-disable @typescript-eslint/no-explicit-any */

import {api} from "@/services/configs";
import {CreateOrUpdateEventType} from "@/types/event";

class Events {
    async getEvents(keyword?: string) {
        return await api.get('/event', {
            params: {
                keyword: keyword || undefined
            }
        })
    }

    async getEventById(eventId: number) {
        return await api.get(`/event/single/${eventId}`, {})
    }

    async create(data: CreateOrUpdateEventType) {
        return await api.post('/event', data)
    }

    async sendNotification(eventId: number) {
        return await api.post(`/event/send/${eventId}`)
    }

    async update(id: number, data: CreateOrUpdateEventType) {
        return await api.put(`/event/${id}`, data)
    }

    async delete(id: number) {
        return await api.delete(`/event/${id}`)
    }
}

export const eventService = new Events();
