import {useMutation, useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/hooks/queryKeys.ts";
import {channelService} from "@/services/api/channel.ts";
import {queryClient} from "@/main.tsx";
import {customToast} from "@/lib/utils.ts";
import {CreateOrUpdateChannelType} from "@/types/channel";
import {useCreateChannelModal, useEditChannelModal} from "@/hooks/useZustand.tsx";

export const useGetChannels = (keyword?: string) => {
    return useQuery({
        queryKey: [queryKeys.GET_CHANNELS],
        queryFn: () => {
            return channelService.getChannels(keyword);
        },
        refetchOnWindowFocus: false,
    });
};

export const useCreateChannel = () => {
    const createChannelModal = useCreateChannelModal()

    return useMutation({
        mutationKey: [queryKeys.CREATE_CANDIDATE],
        mutationFn: (data: CreateOrUpdateChannelType) => {
            return channelService.create(data);
        },
        onSuccess(res) {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_CHANNELS],
            })
            customToast("SUCCESS", "Kanal muvaffaqiyatli qo'shildi!");
            createChannelModal.onClose()
        },
        onError(error: any) {
            console.log(error);
            customToast(
                "ERROR",
                error?.response?.data?.message || "Kanal qo'shishda xatolik!"
            );
        },
    });
};

export const useUpdateChannel = () => {
    const editChannelModal = useEditChannelModal()

    return useMutation({
        mutationKey: [queryKeys.UPDATE_CHANNEL],
        mutationFn: ({channelId, data}: { channelId: string, data: CreateOrUpdateChannelType }) => {
            return channelService.update(channelId, data);
        },
        onSuccess(res) {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_CHANNELS],
            })
            customToast("SUCCESS", "Muvaffaqiyatli tahrirlandi!");
            editChannelModal.onClose()
        },
        onError(error: any) {
            console.log(error);
            customToast(
                "ERROR",
                error?.response?.data?.message || "Tahrirlashda xatolik!"
            );
        },
    });
};

export const useDeleteChannel = () => {
    return useMutation({
        mutationKey: [queryKeys.DELETE_CHANNEL],
        mutationFn: (channelId: string) => {
            return channelService.delete(channelId);
        },
        onSuccess(res) {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_CHANNELS],
            })
            customToast("SUCCESS", "Muvaffaqiyatli o'chirildi!");
        },
        onError(error: any) {
            console.log(error);
            customToast(
                "ERROR",
                error?.response?.data?.message || "O'chirishda xatolik!"
            );
        },
    });
};
