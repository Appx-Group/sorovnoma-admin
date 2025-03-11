import {Navbar} from "@/components";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {EventsTable} from "@/components/tables";
import {DialogModal} from "@/components/ui/dialog.tsx";
import {useCreateEventModal, useEditEventModal} from "@/hooks/useZustand.tsx";
import {EventForm} from "@/components/forms";
import {useDeleteEvent, useGetEndingSoonEvents, useGetEvents} from "@/hooks/useEvents.ts";
import {SingleEventType} from "@/types/event";
import {customToast} from "@/lib/utils.ts";
import {useEffect, useState} from "react";
import StateShower from "@/components/state-shower.tsx";
import {Link} from "react-router-dom";

const Events = () => {
    const [event, setEvent] = useState<SingleEventType>()
    const [keyword, setKeyword] = useState<string>("")
    const [currentTab, setCurrentTab] = useState<string>("all")

    const createEventModal = useCreateEventModal();
    const editEventModal = useEditEventModal();

    const getEventsQuery = useGetEvents(keyword)
    const getEndingSoonEventsQuery = useGetEndingSoonEvents()
    
    const eventsData: SingleEventType[] = getEventsQuery.data?.data?.events || []
    const endingSoonEventsData: SingleEventType[] = getEndingSoonEventsQuery.data?.data?.events || []

    const deleteEventMutation = useDeleteEvent()

    const handleTabChange = (value: string) => {
        setCurrentTab(value);
    };

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

    // Filter events based on the current tab
    const getFilteredEvents = () => {
        if (currentTab === "ending-soon") {
            return endingSoonEventsData;
        }
        
        if (currentTab === "all") {
            return eventsData;
        }
        
        // For other tabs, filter from the main events data
        return eventsData.filter(event => {
            if (currentTab === "active") {
                return event.isActive && 
                    (!event.formattedFinishDate?.isFinished && !event.formattedFinishDate?.isEnding);
            } else if (currentTab === "finished") {
                return event.formattedFinishDate?.isFinished;
            }
            return true;
        });
    };

    useEffect(() => {
        getEventsQuery.refetch();
        if (currentTab === "ending-soon") {
            getEndingSoonEventsQuery.refetch();
        }
    }, [keyword, currentTab]);

    const filteredEvents = getFilteredEvents();

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

            <div className={"flex justify-between mb-4"}>
                <div className={"w-1/4"}>
                    <Input placeholder={"Izlash"} onChange={(e) => setKeyword(e.target.value)}/>
                </div>
                
                <Link to={'/event/create'}>
                    <Button>+Tanlov qo'shish</Button>
                </Link>
            </div>

            <div className="border-b border-gray-200 mb-4">
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleTabChange("all")}
                        className={`py-2 px-4 font-medium text-sm ${
                            currentTab === "all"
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Barcha
                    </button>
                    <button
                        onClick={() => handleTabChange("ending-soon")}
                        className={`py-2 px-4 font-medium text-sm flex items-center ${
                            currentTab === "ending-soon"
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        Tugayapti
                    </button>
                    <button
                        onClick={() => handleTabChange("active")}
                        className={`py-2 px-4 font-medium text-sm flex items-center ${
                            currentTab === "active"
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Faol
                    </button>
                    <button
                        onClick={() => handleTabChange("finished")}
                        className={`py-2 px-4 font-medium text-sm flex items-center ${
                            currentTab === "finished"
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Tugagan
                    </button>
                </div>
            </div>

            {
                (currentTab === "all" && getEventsQuery.isLoading) || 
                (currentTab === "ending-soon" && getEndingSoonEventsQuery.isLoading) ?
                    <StateShower id={"loading"} name={"Loading..."}/>
                    : filteredEvents?.length === 0
                        ? <StateShower id={"no_data"} name={"Tanlovlar topilmadi!"}/>
                        : <EventsTable data={filteredEvents} onEdit={onEditHandler} onDelete={onDeleteHandler}/>
            }
        </>
    )
};

export default Events;