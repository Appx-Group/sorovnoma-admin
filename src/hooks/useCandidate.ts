import {useMutation, useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/hooks/queryKeys.ts";
import {candidateService} from "@/services/api/candidate.ts";
import {queryClient} from "@/main.tsx";
import {customToast} from "@/lib/utils.ts";
import {UpdateCandidateType} from "@/types/candidate";
import {useCreateCandidateModal, useEditCandidateModal} from "@/hooks/useZustand.tsx";

export const useGetCandidates = (isEnabled: boolean = true, eventId: number, keyword?: string) => {
    return useQuery({
        queryKey: [queryKeys.GET_CANDIDATES],
        queryFn: () => {
            return candidateService.getCandidates(eventId, keyword);
        },
        refetchOnWindowFocus: false,
        enabled: isEnabled,
    });
};

export const useCreateCandidate = () => {
    const createCandidateModal = useCreateCandidateModal()

    return useMutation({
        mutationKey: [queryKeys.CREATE_CANDIDATE],
        mutationFn: ({eventId, name}: { eventId: number, name: string }) => {
            return candidateService.create(eventId, name);
        },
        onSuccess(res) {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_CANDIDATES],
            })
            customToast("SUCCESS", "Nomzod yaratildi!");
            createCandidateModal.onClose()
        },
        onError(error: any) {
            console.log(error);
            customToast(
                "ERROR",
                error?.response?.data?.message || "Nomzodni yaratishda xatolik!"
            );
        },
    });
};

export const useUpdateCandidate = () => {
    const editCandidateModal = useEditCandidateModal()

    return useMutation({
        mutationKey: [queryKeys.UPDATE_CANDIDATE],
        mutationFn: ({candidateId, data}: { candidateId: number, data: UpdateCandidateType }) => {
            return candidateService.update(candidateId, data);
        },
        onSuccess(res) {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_CANDIDATES],
            })
            customToast("SUCCESS", "Muvaffaqiyatli tahrirlandi!");
            editCandidateModal.onClose()
        },
        onError(error: any) {
            console.log(error);
            customToast(
                "ERROR",
                error?.response?.data?.message || "Nomzodni tahrirashda xatolik!"
            );
        },
    });
};

export const useDeleteCandidate = () => {
    return useMutation({
        mutationKey: [queryKeys.DELETE_CANDIDATE],
        mutationFn: (candidateId: number) => {
            return candidateService.delete(candidateId);
        },
        onSuccess(res) {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_CANDIDATES],
            })
            customToast("SUCCESS", "Muvaffaqiyatli o'chirildi!");
        },
        onError(error: any) {
            console.log(error);
            customToast(
                "ERROR",
                error?.response?.data?.message || "Nomzodni o'chirishda xatolik!"
            );
        },
    });
};