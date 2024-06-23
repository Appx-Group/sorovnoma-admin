/* eslint-disable @typescript-eslint/no-explicit-any */
import {api} from "../configs";
import {UpdateCandidateType} from "@/types/candidate";

class Candidate {
    getCandidates = async (eventId: number, keyword?: string) => {
        return await api.get(`/candidate/event/${eventId}`, {
            params: {
                keyword: keyword || undefined
            }
        });
    };
    create = async (eventId: number, name: string) => {
        return await api.post('/candidate', {
            eventId,
            name
        })
    }
    update = async (id: number, data: UpdateCandidateType) => {
        return await api.put(`/candidate/${id}`, data)
    }
    delete = async (id: number) => {
        return await api.delete(`/candidate/${id}`);
    }
}

export const candidateService = new Candidate();
