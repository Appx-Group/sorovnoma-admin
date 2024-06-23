import {Navbar} from "@/components";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {EventsTable} from "@/components/tables";
import {DialogModal} from "@/components/ui/dialog.tsx";
import {useCreateEventModal, useEditEventModal} from "@/hooks/useZustand.tsx";
import {EventForm} from "@/components/forms";
import {useDeleteEvent, useGetEvents} from "@/hooks/useEvents.ts";
import {SingleEventType} from "@/types/event";
import {customToast} from "@/lib/utils.ts";
import {useEffect, useState} from "react";
import StateShower from "@/components/state-shower.tsx";
import {Link} from "react-router-dom";

const Events = () => {
    const [event, setEvent] = useState<SingleEventType>()
    const [keyword, setKeyword] = useState<string>("")

    const createEventModal = useCreateEventModal();
    const editEventModal = useEditEventModal();

    const getEventsQuery = useGetEvents(keyword)
    const eventsData: SingleEventType[] = getEventsQuery.data?.data?.events

    const deleteEventMutation = useDeleteEvent()

    const onEditHandler = (id: number) => {
        const findEvent = eventsData.find(event => event.id === id);
        if (!findEvent) {
            return customToast("ERROR", "Tanlov topilmadi!")
        }
        setEvent(findEvent)
    }

    const onDeleteHandler = (id: number) => {
        const isOk = confirm("Haqiqatdan ham o'chirmoqchimisiz?")
        if (isOk) {
            deleteEventMutation.mutate(id)
        }
    }

    useEffect(() => {
        getEventsQuery.refetch()
    }, [keyword]);

    return (
        <>
            {/* Create event modal */}
            <DialogModal isOpen={createEventModal.isOpen} onClose={createEventModal.onClose} className={"w-[1000px]"}>
                <EventForm action={"CREATE"}/>
            </DialogModal>

            {/* Edit event modal */}
            <DialogModal isOpen={editEventModal.isOpen} onClose={editEventModal.onClose} className={"w-[1000px]"}>
                <EventForm action={"EDIT"} data={event}/>
            </DialogModal>

            <Navbar name={"Tanlovlar"}/>

            <div className={"flex justify-between"}>
                <div className={"w-1/4"}>
                    <Input placeholder={"Izlash"} onChange={(e) => setKeyword(e.target.value)}/>
                </div>
                
                <Link to={'/event/create'}>
                    <Button>+Tanlov qo'shish</Button>
                </Link>
            </div>

            {
                getEventsQuery.isLoading ?
                    <StateShower id={"loading"} name={"Loading..."}/>
                    : eventsData?.length === 0
                        ? <StateShower id={"no_data"} name={"Tanlovlar topilmadi!"}/>
                        : <EventsTable data={eventsData} onEdit={onEditHandler} onDelete={onDeleteHandler}/>
            }
        </>
    )
};

export default Events;