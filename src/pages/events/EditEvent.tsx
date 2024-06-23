import {Navbar} from "@/components";
import {CandidateForm, EventForm} from "@/components/forms";
import {useCreateCandidateModal, useEditCandidateModal} from "@/hooks/useZustand.tsx";
import {useEffect, useState} from "react";
import {SingleCandidateType} from "@/types/candidate";
import {useParams} from "react-router-dom";
import {useDeleteCandidate, useGetCandidates} from "@/hooks/useCandidate.ts";
import {customToast} from "@/lib/utils.ts";
import StateShower from "@/components/state-shower.tsx";
import {CandidatesTable} from "@/components/tables";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DialogModal} from "@/components/ui/dialog.tsx";
import {useGetSingleEvent} from "@/hooks/useEvents.ts";
import {SingleEventType} from "@/types/event";

const EditEvent = () => {
    const createCandidateModal = useCreateCandidateModal();
    const editCandidateModal = useEditCandidateModal()

    const [candidate, setCandidate] = useState<SingleCandidateType>();
    const [keyword, setKeyword] = useState<string>("")

    const {eventId} = useParams()

    const getCandidatesQuery = useGetCandidates(true, +eventId!, keyword)
    const candidatesData: SingleCandidateType[] = getCandidatesQuery.data?.data?.candidates

    // single event info
    const getSingleEventQuery = useGetSingleEvent(+eventId!)
    const eventInfo: SingleEventType = getSingleEventQuery.data?.data?.info

    const deleteCandidateMutation = useDeleteCandidate()

    const onEditCandidate = (id: number) => {
        const findCandidate = candidatesData.find(event => event.id === id)
        if (!findCandidate) {
            return customToast("ERROR", "Nomzod topilmadi!")
        }
        setCandidate(findCandidate)
    }

    const onDeleteCandidate = (id: number) => {
        const isOk = confirm("Haqiqatdan ham o'chirmoqchimisiz?")
        if (isOk) {
            deleteCandidateMutation.mutate(id)
        }
    }

    useEffect(() => {
        getCandidatesQuery.refetch()
    }, [keyword]);

    if (getSingleEventQuery.isFetching) {
        return <StateShower id={"loading"} name={"Loading..."}/>
    }

    return (
        <>
            {/* create candidate modal */}
            <DialogModal isOpen={createCandidateModal.isOpen} onClose={createCandidateModal.onClose}>
                <CandidateForm action={"CREATE"} eventId={+eventId!}/>
            </DialogModal>

            {/* edit candidate modal */}
            <DialogModal isOpen={editCandidateModal.isOpen} onClose={editCandidateModal.onClose}>
                <CandidateForm action={"EDIT"} data={candidate} eventId={+eventId!}/>
            </DialogModal>

            <Navbar name={"Tanlov ma'lumotari"}/>

            {
                getSingleEventQuery.isLoading ? <StateShower id={"loading"} name={"Loading..."}/> : <>
                    <EventForm action={"EDIT"} data={eventInfo} eventId={+eventId!}/>

                    <div
                        className={"flex flex-col gap-5 p-4 rounded-sm shadow-sm border bg-white "}>
                        <div className={"flex justify-between"}>
                            <div className={"w-1/4"}>
                                <Input placeholder={"Izlash"} onChange={(e) => setKeyword(e.target.value)}/>
                            </div>
                            <Button onClick={createCandidateModal.onOpen}>+ Nomzod qo'shish</Button>
                        </div>

                        {
                            getCandidatesQuery?.isLoading ?
                                <StateShower id={"loading"} name={"Loading..."}/>
                                : candidatesData?.length === 0
                                    ? <StateShower id={"no_data"} name={"Nomzodlar topilmadi!"}/>
                                    : <CandidatesTable data={candidatesData} onEdit={onEditCandidate}
                                                       onDelete={onDeleteCandidate}/>
                        }
                    </div>
                </>
            }
        </>
    )
};

export default EditEvent;