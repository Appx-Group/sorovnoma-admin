import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {AiOutlineDelete} from "react-icons/ai";
import {FiEdit} from "react-icons/fi";
import {useEditCandidateModal} from "@/hooks/useZustand.tsx";
import {SingleCandidateType} from "@/types/candidate";
import {dateFormatter} from "@/lib/utils.ts";

type CandidateTableProps = {
    data: SingleCandidateType[]
    onEdit: (id: number) => void
    onDelete: (id: number) => void
}

const CandidatesTable = ({data, onEdit, onDelete}: CandidateTableProps) => {
    const editCandidateModal = useEditCandidateModal()

    return (
        <div className={"bg-white  rounded-md"}>
            <Table className="max-lg:w-[700px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className={"w-20"}>ID</TableHead>
                        <TableHead>Ism familiya</TableHead>
                        <TableHead>Ovozlar soni</TableHead>
                        <TableHead>CreatedAt</TableHead>
                        <TableHead>UpdatedAt</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        data?.map(candidate => (
                            <TableRow key={candidate.id}>
                                <TableCell>{candidate.id}</TableCell>
                                <TableCell>{candidate.name}</TableCell>
                                <TableCell>{candidate.votes}</TableCell>
                                <TableCell>{dateFormatter(candidate.createdAt)}</TableCell>
                                <TableCell>{dateFormatter(candidate.updatedAt)}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <FiEdit
                                            onClick={() => {
                                                onEdit(candidate.id)
                                                editCandidateModal.onOpen()
                                            }}
                                            className="text-[18px] text-amber-700 opacity-60 cursor-pointer"
                                        />
                                        <AiOutlineDelete
                                            className={"text-[19px] text-destructive cursor-pointer"}
                                            onClick={() => onDelete(candidate.id)}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
};

export default CandidatesTable;