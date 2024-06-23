import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {AiOutlineDelete} from "react-icons/ai";
import {FiEdit} from "react-icons/fi";
import {useEditChannelModal} from "@/hooks/useZustand.tsx";
import {SingleChannelType} from "@/types/channel";
import {dateFormatter} from "@/lib/utils.ts";

type ChannelProps = {
    data: SingleChannelType[]
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

const ChannelsTable = ({data, onEdit, onDelete}: ChannelProps) => {
    const editChannelModal = useEditChannelModal();

    return (
        <div className={"bg-white shadow rounded-md"}>
            <Table className="max-lg:w-[700px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className={"min-w-20"}>ID</TableHead>
                        <TableHead>Nomi</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>CreatedAt</TableHead>
                        <TableHead>UpdatedAt</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {
                        data?.map((channel => (
                            <TableRow key={channel.id}>
                                <TableCell>{channel.id}</TableCell>
                                <TableCell>{channel.name}</TableCell>
                                <TableCell>{channel.link}</TableCell>
                                <TableCell>{dateFormatter(channel.createdAt)}</TableCell>
                                <TableCell>{dateFormatter(channel.updatedAt)}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <FiEdit
                                            onClick={() => {
                                                onEdit(channel.id!)
                                                editChannelModal.onOpen()
                                            }}
                                            className="text-[18px] text-amber-700 opacity-60 cursor-pointer"
                                        />
                                        <AiOutlineDelete
                                            onClick={() => onDelete(channel.id)}
                                            className={"text-[19px] text-destructive cursor-pointer"}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )))
                    }
                </TableBody>
            </Table>
        </div>
    )
};

export default ChannelsTable;