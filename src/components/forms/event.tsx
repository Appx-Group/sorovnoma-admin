import {EventSchema} from "@/lib";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import Uploader from "@/components/ui/uploader.tsx";
import Select from 'react-select';
import "react-quill/dist/quill.snow.css";
import "../../styles/editor.css";
import {useCreateEvent, useSendEventNotification, useUpdateEvent} from "@/hooks/useEvents.ts";
import {CreateOrUpdateEventType, SingleEventType} from "@/types/event";
import {useGetChannels} from "@/hooks/useChannels.ts";
import {SingleChannelType} from "@/types/channel";
import DatePickerDemo from "@/components/ui/date-picker.tsx";
import {useGetCandidates} from "@/hooks/useCandidate.ts";
import {SingleCandidateType} from "@/types/candidate";
import {PiTelegramLogo} from "react-icons/pi";
import {Textarea} from "@/components/ui/textarea.tsx";

type EventFormProps = {
    action: "CREATE" | "EDIT",
    data?: SingleEventType,
    eventId?: number
}

const sanitizeOptions = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', "br"],
    allowedAttributes: {
        'a': ['href']
    },
    allowedSchemes: ['http', 'https', 'mailto']
};

const convertHtmlToPlainText = (htmlContent: any) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;

    // Replace <br> tags with newline characters
    div.querySelectorAll("br").forEach((br) => {
        br.replaceWith("\n");
    });

    return div.innerText;
};

const EventForm = ({action, data, eventId}: EventFormProps) => {

    const getCandidatesQuery = useGetCandidates(action === "EDIT", +eventId!)
    const candidatesData: SingleCandidateType[] = getCandidatesQuery.data?.data?.candidates

    const sendNotificationMutation = useSendEventNotification()

    const form = useForm<z.infer<typeof EventSchema>>({
        resolver: zodResolver(EventSchema),
        defaultValues: {
            name: data?.name,
            descr: data?.descr,
            image: data?.imageUrl,
            subscribeChannels: data?.subscribeChannels,
            sentChannels: data?.sentChannels,
            finishDate: data?.finishDate,
        }
    });

    const createEventMutation = useCreateEvent()
    const updateEventMutation = useUpdateEvent()

    const getChannelsQuery = useGetChannels()
    const channelsData: SingleChannelType[] = getChannelsQuery.data?.data?.channels

    function onSendTelegram() {
        if (action === "EDIT") {
            sendNotificationMutation.mutate(data?.id!)
        }
    }

    function onSubmit(values: z.infer<typeof EventSchema>) {
        const formData = new FormData();

        // // Sanitize description
        // const sanitizedDescr = sanitizeHtml(convertHtmlToPlainText(values?.descr!), sanitizeOptions);
        //
        // console.log(values.descr)
        // console.log(sanitizedDescr)


        Object.entries(values).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value, value.name);
            } else {
                if (value !== undefined) {
                    
                    if (key === "subscribeChannels") {
                        // @ts-ignore
                        if (value.some(channel => channel.hasOwnProperty("createdAt"))) {
                            formData.append(key, JSON.stringify(value.map((channel: { id: any; }) => channel.id)));
                        } else {
                            formData.append(key, JSON.stringify(value));
                        }
                    } else if (key === "sentChannels") {
                        // @ts-ignore
                        if (value.some(channel => channel.hasOwnProperty("createdAt"))) {
                            formData.append(key, JSON.stringify(value.map((channel: { id: any; }) => channel.id)));
                        } else {
                            formData.append(key, JSON.stringify(value));
                        }
                    } else if (key === "finishDate") {
                        formData.append(key, new Date(value).toISOString());
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            }
        });

        for (let [key, value] of formData.entries()) {
            console.log(`${key} ${value}`)

            if (key === "image") {
                if (typeof value !== "object") {
                    formData.delete("image")
                }
            }
        }

        if (action === "CREATE") {
            createEventMutation.mutate(formData as unknown as CreateOrUpdateEventType)

        } else if (action === "EDIT") {
            updateEventMutation.mutate({
                id: data?.id!,
                data: formData as unknown as CreateOrUpdateEventType
            })
        } else {
            return null
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={`flex flex-col gap-5 bg-white p-5 border shadow-sm `}
            >


                <div className="flex flex-col gap-2">
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Nomi:</FormLabel>
                                <FormControl>
                                    <Input placeholder="nomini kiriting" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className={`grid grid-cols-2 gap-4`}>
                        {/* End Date */}
                        <FormField
                            control={form.control}
                            name="finishDate"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Tugash sanasi:</FormLabel>
                                    <FormControl>
                                        <DatePickerDemo
                                            placeholder={"Tugash sanasi"}
                                            date={form.getValues("finishDate")}
                                            setDate={(date) => {
                                                form.setValue("finishDate", date!)
                                            }}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Cover image */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Muqova rasmi:</FormLabel>
                                    <FormControl>
                                        <Uploader
                                            name={data?.imageName}
                                            image_url={field.value}
                                            setFile={(value) => form.setValue("image", value)}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Subscribe channels */}
                        <FormField
                            control={form.control}
                            name="subscribeChannels"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Obuna bo'ladigan kanallar:</FormLabel>
                                    <FormControl>
                                        <Select
                                            isMulti={true}
                                            name="colors"
                                            options={channelsData?.map((channel) => {
                                                return {
                                                    value: channel.id,
                                                    label: channel?.name
                                                }
                                            })}
                                            defaultValue={data?.subscribeChannels?.map((channel) => {
                                                return {
                                                    value: channel.id,
                                                    label: channel?.name
                                                }
                                            })}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            onChange={(values) => {
                                                form.setValue("subscribeChannels", values.map(item => item.value))
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />


                        {/* Send channels */}
                        <FormField
                            control={form.control}
                            name="sentChannels"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Xabar yuboriladigan kanallar:</FormLabel>
                                    <FormControl>
                                        <Select
                                            isMulti={true}
                                            isDisabled={action === "EDIT"}
                                            name="subschannels"
                                            options={channelsData?.map((channel) => {
                                                return {
                                                    value: channel.id,
                                                    label: channel?.name
                                                }
                                            })}
                                            defaultValue={data?.sentChannels?.map((channel) => {
                                                return {
                                                    value: channel.id,
                                                    label: channel?.name
                                                }
                                            })}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            onChange={(values) => {
                                                form.setValue("sentChannels", values.map(item => item.value))
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="descr"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Tavsif:</FormLabel>
                                <FormControl>
                                    <Textarea placeholder={"Tavsif kiriting"} className={"min-h-28"} {...field}/>
                                    {/*<ReactQuill className="bg-white " {...field} />*/}
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className={"flex gap-3"}>
                        <Button
                            isLoading={createEventMutation.isPending || updateEventMutation.isPending}>{action === "CREATE" ? "Qo'shish" : "O'zgarishlarni saqlash"}</Button>

                        <Button
                            disabled={action === "EDIT" && candidatesData?.length === 0 || sendNotificationMutation.isPending}
                            type={"button"}
                            isLoading={sendNotificationMutation.isPending}
                            onClick={onSendTelegram}
                            className={`bg-blue-500 hover:bg-blue-500 flex gap-1 items-center ${action === "CREATE" && "hidden"}`}
                        >
                            <PiTelegramLogo/>
                            <span>Yuborish</span>
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default EventForm;
