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

    async getEndingSoonEvents() {
        return await api.get('/event/ending-soon')
    }

    async getEventById(eventId: number) {
        return await api.get(`/event/single/${eventId}`, {})
    }

    async create(data: CreateOrUpdateEventType) {
        // For debugging
        console.log("Creating event with data:", 
            data instanceof FormData 
            ? Object.fromEntries(data.entries()) 
            : data
        );

        // Convert FormData to regular object if needed (to ensure date formatting)
        if (data instanceof FormData) {
            // Create a regular object from FormData
            const obj: Record<string, any> = {};
            
            for (let [key, value] of data.entries()) {
                // Special handling for finishDate to ensure correct format
                if (key === 'finishDate') {
                    try {
                        // Parse and reformat the date to ensure it's valid ISO format
                        const dateVal = new Date(value.toString()).toISOString();
                        obj[key] = dateVal;
                    } catch (e) {
                        console.error("Error formatting finishDate:", e);
                        // If parsing fails, include the original value
                        obj[key] = value;
                    }
                }
                // Special handling for subscribeChannels and sentChannels
                else if (key === 'subscribeChannels' || key === 'sentChannels') {
                    try {
                        // Parse JSON strings to objects
                        obj[key] = JSON.parse(value.toString());
                    } catch (e) {
                        obj[key] = value;
                    }
                } 
                else {
                    obj[key] = value;
                }
            }
            
            console.log("Converted to object:", obj);
            return await api.post('/event', obj);
        }
        
        return await api.post('/event', data);
    }

    async sendNotification(eventId: number) {
        return await api.post(`/event/send/${eventId}`)
    }

    async update(id: number, data: CreateOrUpdateEventType) {
        // For debugging
        console.log("Updating event with data:", 
            data instanceof FormData 
            ? Object.fromEntries(data.entries()) 
            : data
        );

        // Convert FormData to regular object if needed (to ensure date formatting)
        if (data instanceof FormData) {
            // Create a regular object from FormData
            const obj: Record<string, any> = {};
            
            for (let [key, value] of data.entries()) {
                // Special handling for finishDate to ensure correct format
                if (key === 'finishDate') {
                    try {
                        // Parse and reformat the date to ensure it's valid ISO format
                        const dateVal = new Date(value.toString()).toISOString();
                        obj[key] = dateVal;
                    } catch (e) {
                        console.error("Error formatting finishDate:", e);
                        // If parsing fails, include the original value
                        obj[key] = value;
                    }
                }
                // Special handling for subscribeChannels and sentChannels
                else if (key === 'subscribeChannels' || key === 'sentChannels') {
                    try {
                        // Parse JSON strings to objects
                        obj[key] = JSON.parse(value.toString());
                    } catch (e) {
                        obj[key] = value;
                    }
                } 
                else {
                    obj[key] = value;
                }
            }
            
            console.log("Converted to object:", obj);
            return await api.put(`/event/${id}`, obj);
        }
        
        return await api.put(`/event/${id}`, data);
    }

    async delete(id: number) {
        return await api.delete(`/event/${id}`)
    }
}

export const eventService = new Events();
