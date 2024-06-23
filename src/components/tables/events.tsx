import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {AiOutlineDelete} from "react-icons/ai";
import {FiEdit} from "react-icons/fi";
import {useNavigate} from "react-router-dom";
import {useEditEventModal} from "@/hooks/useZustand.tsx";
import {SingleEventType} from "@/types/event";
import {dateFormatter} from "@/lib/utils.ts";

type EventTableProps = {
    data: SingleEventType[]
    onEdit: (id: number) => void
    onDelete: (id: number) => void
}

const EventsTable = ({data, onEdit, onDelete}: EventTableProps) => {
    const navigate = useNavigate();
    const editEventModal = useEditEventModal();

    const onNavigateToCandidates = (eventId: number) => {
        return navigate(`/event/edit/${eventId}`);
    }

    return (
        <div className={"bg-white shadow rounded-md"}>
            <Table className="max-lg:w-[700px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className={"w-20"}>ID</TableHead>
                        <TableHead>Nomi</TableHead>
                        <TableHead>Muqova rasmi</TableHead>
                        <TableHead>Tugash sanasi</TableHead>
                        <TableHead>CreatedAt</TableHead>
                        <TableHead>UpdatedAt</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.map(event => (
                        <TableRow key={event.id}>
                            <TableCell>{event.id}</TableCell>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>
                                <img
                                    className={"h-20 w-32"}
                                    src={event.imageUrl}
                                    alt="#"/>
                            </TableCell>
                            <TableCell>{dateFormatter(String(event.finishDate), false)}</TableCell>
                            <TableCell>{dateFormatter(event.createdAt)}</TableCell>
                            <TableCell>{dateFormatter(event.updatedAt)}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <FiEdit
                                        onClick={() => {
                                            onNavigateToCandidates(event.id)
                                        }}
                                        className="text-[18px] text-amber-700 opacity-60 cursor-pointer"
                                    />
                                    <AiOutlineDelete
                                        className={"text-[19px] text-destructive cursor-pointer"}
                                        onClick={() => onDelete(event.id)}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
};

export default EventsTable;