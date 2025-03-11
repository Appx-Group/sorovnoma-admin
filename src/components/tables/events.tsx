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

    const getEventStatus = (event: SingleEventType) => {
        if (!event.formattedFinishDate) return null;

        if (event.formattedFinishDate.isFinished) {
            return { label: "Tugagan", className: "text-gray-500 bg-gray-100" };
        } else if (event.formattedFinishDate.isEnding) {
            return { label: "Tugayapti", className: "text-amber-700 bg-amber-50" };
        } else if (event.isActive) {
            return { label: "Faol", className: "text-green-700 bg-green-50" };
        } else {
            return { label: "Faol emas", className: "text-red-700 bg-red-50" };
        }
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
                        <TableHead>Status</TableHead>
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
                            <TableCell>
                                {event.formattedFinishDate ? (
                                    <div title={`${event.formattedFinishDate.date} ${event.formattedFinishDate.time}`}>
                                        <div>{event.formattedFinishDate.date}</div>
                                        <div>{event.formattedFinishDate.time}</div>
                                        {event.formattedFinishDate.timeRemaining && (
                                            <div className="text-sm text-gray-500 mt-1">
                                                {event.formattedFinishDate.timeRemaining}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    dateFormatter(String(event.finishDate), true)
                                )}
                            </TableCell>
                            <TableCell>
                                {event.formattedFinishDate && getEventStatus(event) && (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventStatus(event)?.className}`}>
                                        {getEventStatus(event)?.label}
                                    </span>
                                )}
                            </TableCell>
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