import {useMutation, useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/hooks/queryKeys.ts";
import {eventService} from "@/services/api";
import {customToast} from "@/lib/utils.ts";
import {CreateOrUpdateEventType} from "@/types/event";
import {useCreateEventModal, useEditEventModal} from "@/hooks/useZustand.tsx";
import {queryClient} from "@/main.tsx";
import {useNavigate} from "react-router-dom";

export const useGetEvents = (keyword?: string) => {
    return useQuery({
        queryKey: [queryKeys.GET_EVENTS],
        queryFn: () => {
            return eventService.getEvents(keyword);
        },
        refetchOnWindowFocus: false,
    });
};

export const useGetEndingSoonEvents = () => {
    return useQuery({
        queryKey: [queryKeys.GET_ENDING_SOON_EVENTS],
        queryFn: () => {
            return eventService.getEndingSoonEvents();
        },
        refetchOnWindowFocus: false,
    });
};

export const useGetSingleEvent = (eventId: number) => {
    return useQuery({
        queryKey: [queryKeys.GET_SINGLE_EVENT],
        queryFn: () => {
            return eventService.getEventById(eventId);
        },
        refetchOnWindowFocus: false,
    });
};

export const useCreateEvent = () => {
    const createEventModal = useCreateEventModal()
    const navigate = useNavigate();

    return useMutation({
        mutationKey: [queryKeys.CREATE_EVENT],
        mutationFn: (data: CreateOrUpdateEventType) => {
            return eventService.create(data);
        },
        onSuccess(data) {
            createEventModal.onClose()
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_EVENTS],
            })
            customToast("SUCCESS", "Tanlov yaratildi!");
            navigate(`/event/edit/${data?.data?.info?.id}`);
        },
        onError(error: any) {
            console.log(error);
            customToast(
                "ERROR",
                error?.response?.data?.message || "Tanlov yaratishda xatolik!"
            );
        },
    });
};

export const useSendEventNotification = () => {
    return useMutation({
        mutationKey: [queryKeys.CREATE_EVENT],
        mutationFn: (eventId: number) => {
            return eventService.sendNotification(eventId);
        },
        onSuccess(data) {
            customToast("SUCCESS", "Muvaffaqiyatli yuborildi!");
        },
        onError(error: any) {
            console.log(error);
            customToast(
                "ERROR",
                error?.response?.data?.message || "Yuborishda xatolik!"
            );
        },
    });
};

export const useUpdateEvent = () => {
    const updateEventModal = useEditEventModal()

    return useMutation({
        mutationKey: [queryKeys.UPDATE_EVENT],
        mutationFn: ({id, data}: { id: number, data: CreateOrUpdateEventType }) => {
            return eventService.update(id, data);
        },
        onSuccess(res) {
            updateEventModal.onClose()
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_EVENTS],
            })
            customToast("SUCCESS", "Tanlov tahrirlandi!");
        },
        onError(error: any) {
            console.log(error);
            customToast(
                "ERROR",
                error?.response?.data?.message || "Tanlovni tahrirlashda xatolik!"
            );
        },
    });
};

export const useDeleteEvent = () => {
    return useMutation({
        mutationKey: [queryKeys.UPDATE_EVENT],
        mutationFn: (id: number) => {
            return eventService.delete(id);
        },
        onSuccess(res) {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_EVENTS],
            })
            customToast("SUCCESS", "Tanlov o'chirildi!!");
        },
        onError(error: any) {
            console.log(error);
            customToast(
                "ERROR",
                error?.response?.data?.message || "Tanlovni o'chirishda xatolik!"
            );
        },
    });
};