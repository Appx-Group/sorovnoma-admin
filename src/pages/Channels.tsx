import {Navbar} from "@/components";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChannelsTable} from "@/components/tables";
import {useCreateChannelModal, useEditChannelModal} from "@/hooks/useZustand.tsx";
import {DialogModal} from "@/components/ui/dialog.tsx";
import {ChannelForm} from "@/components/forms";
import {useDeleteChannel, useGetChannels} from "@/hooks/useChannels.ts";
import {SingleChannelType} from "@/types/channel";
import StateShower from "@/components/state-shower.tsx";
import {useEffect, useState} from "react";
import {customToast} from "@/lib/utils.ts";

const Channels = () => {
    const createChannelModal = useCreateChannelModal();
    const editChannelModal = useEditChannelModal();

    const [channel, setChannel] = useState<SingleChannelType>();
    const [keyword, setKeyword] = useState<string>("")

    const getChannelsQuery = useGetChannels(keyword);
    const channelsData: SingleChannelType[] = getChannelsQuery.data?.data.channels

    const deleteChannelMutation = useDeleteChannel()

    const onEdit = (id: string) => {
        const findChannel = channelsData.find((channel) => channel.id === id);
        if (!findChannel) {
            return customToast("ERROR", "Kanal topilmadi!")
        }
        setChannel(findChannel);
    }

    const onDelete = (id: string) => {
        const isOk = confirm("Haqiqatdan ham o'chirmoqchimisiz?")
        if (isOk) {
            deleteChannelMutation.mutate(id)
        }
    }

    useEffect(() => {
        getChannelsQuery.refetch()
    }, [keyword]);

    return (
        <>
            {/* create channel modal */}
            <DialogModal isOpen={createChannelModal.isOpen} onClose={createChannelModal.onClose}>
                <ChannelForm action={"CREATE"}/>
            </DialogModal>

            {/* edit channel modal */}
            <DialogModal isOpen={editChannelModal.isOpen} onClose={editChannelModal.onClose}>
                <ChannelForm action={"EDIT"} data={channel}/>
            </DialogModal>

            <Navbar name={"Kanallar"}/>

            <div className={"flex justify-between"}>
                <div className={"w-1/4"}>
                    <Input placeholder={"Izlash"} onChange={(e) => setKeyword(e.target.value)}/>
                </div>

                <Button onClick={createChannelModal.onOpen}>+ Kanal qo'shish</Button>
            </div>

            {
                getChannelsQuery.isLoading ?
                    <StateShower id={"loading"} name={"Loading..."}/> : channelsData?.length === 0 ?
                        <StateShower id={"no_data"} name={"Kanallar topilmadi!"}/> :
                        <ChannelsTable data={channelsData} onEdit={onEdit} onDelete={onDelete}/>
            }
        </>
    )
};

export default Channels;