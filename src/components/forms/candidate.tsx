import {CandidateSchema} from "@/lib";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {SingleCandidateType} from "@/types/candidate";
import {useCreateCandidate, useUpdateCandidate} from "@/hooks/useCandidate.ts";

type CandidateProps = {
    action: "CREATE" | "EDIT",
    data?: SingleCandidateType,
    eventId: number
}

const CandidateForm = ({action, data, eventId}: CandidateProps) => {
    const form = useForm<z.infer<typeof CandidateSchema>>({
        resolver: zodResolver(CandidateSchema),
        defaultValues: {
            name: data?.name,
        }
    });

    const createCandidateMutation = useCreateCandidate()
    const updateCandidateMutation = useUpdateCandidate()

    function onSubmit(values: z.infer<typeof CandidateSchema>) {
        if (action === "CREATE") {
            createCandidateMutation.mutate({
                eventId,
                name: values.name
            })
        } else if (action === "EDIT") {
            updateCandidateMutation.mutate({
                candidateId: data?.id!,
                data: {
                    eventId,
                    name: values.name,
                }
            })
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
            >
                <h1 className="text-xl font-semibold text-center">{action === "CREATE" ? "Nomzod qo'shish" : "Tahrirlash"}</h1>

                <div className="flex flex-col gap-2">
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Ism kiriting:</FormLabel>
                                <FormControl>
                                    <Input placeholder="ism kiriting" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button
                        isLoading={createCandidateMutation.isPending || updateCandidateMutation.isPending}>{action === "CREATE" ? "Qo'shish" : "O'zgarishlarni saqlash"}</Button>
                </div>
            </form>
        </Form>
    );
};

export default CandidateForm;
