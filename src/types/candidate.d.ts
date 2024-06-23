export type SingleCandidateType = {
    id: number,
    eventId: number,
    name: string,
    createdAt: string,
    updatedAt: string,
    votes: 0
}

export type UpdateCandidateType = {
    eventId: number,
    name: string,
}