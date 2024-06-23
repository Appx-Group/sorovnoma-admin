import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {ChannelSchema} from "@/lib";
import {SingleChannelType} from "@/types/channel";
import {useCreateChannel, useUpdateChannel} from "@/hooks/useChannels.ts";

type ChannelProps = {
    action: "CREATE" | "EDIT";
    data?: SingleChannelType
};

const ChannelForm = ({action, data}: ChannelProps) => {
    const form = useForm<z.infer<typeof ChannelSchema>>({
        resolver: zodResolver(ChannelSchema),
        defaultValues: {
            id: data?.id,
            name: data?.name,
            link: data?.link,
        }
    });

    const createChannelMutation = useCreateChannel()
    const updateChannelMutation = useUpdateChannel()

    function onSubmit(values: z.infer<typeof ChannelSchema>) {
        if (action === "CREATE") {
            createChannelMutation.mutate(values)
        } else if (action === "EDIT") {
            updateChannelMutation.mutate({
                channelId: data?.id!,
                data: values
            })
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
            >
                <h1 className="text-[22px] font-semibold text-center ">
                    {action === "CREATE" ? "Kanal qo'shish" : "Tahrirlash"}
                </h1>

                <div className="flex flex-col gap-3">
                    {/* name (channel name) */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Nomi:</FormLabel>
                                <FormControl>
                                    <Input placeholder="kanal nomi" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* channelId */}
                    <FormField
                        control={form.control}
                        name="id"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>ID:</FormLabel>
                                <FormControl>
                                    <Input placeholder="kanal idsi" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    {/* link (channel username) */}
                    <FormField
                        control={form.control}
                        name="link"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>LINK:</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="kanal linki"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button isLoading={createChannelMutation.isPending || updateChannelMutation.isPending}>
                        {action === "CREATE" ? "Qo'shish" : "O'zgarishlarni saqlash"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ChannelForm;
