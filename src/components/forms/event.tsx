import {EventSchema} from "@/lib";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

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
import DateTimePicker, { getMinimumAllowedDateTime } from "@/components/ui/date-time-picker.tsx";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { customToast } from "@/lib/utils.ts";

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

    const [mediaData, setMediaData] = useState<{ imageUrl: string; imageId: string; imageName: string } | null>(null);

    const form = useForm<z.infer<typeof EventSchema>>({
        resolver: zodResolver(EventSchema),
        defaultValues: {
            name: data?.name,
            descr: data?.descr,
            image: data?.imageUrl,
            subscribeChannels: data?.subscribeChannels,
            sentChannels: data?.sentChannels,
            finishDate: data?.finishDate ? new Date(data.finishDate) : undefined,
            isActive: data?.isActive ?? true,
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

    const handleMediaUploadSuccess = (response: any) => {
        if (response && response.success && response.data) {
            // Updated to match the format from the API: { url, key, project, id }
            setMediaData({
                imageUrl: response.data.url,
                imageId: response.data.key,
                imageName: response.data.key.split('/').pop() || 'image'
            });
            
            form.setValue("image", response.data.url);
        } else if (response && response.success && response.data === null) {
            // Handle delete case
            setMediaData(null);
            form.setValue("image", undefined);
        }
    };

    function onSubmit(values: z.infer<typeof EventSchema>) {
        const formData = new FormData();

        // Handle date formatting
        if (values.finishDate) {
            try {
                // Ensure the date is valid and at least 10 minutes in the future
                const currentDate = new Date();
                const minDate = new Date(currentDate.getTime() + 10 * 60 * 1000);
                const dateObj = new Date(values.finishDate);
                
                if (dateObj < minDate) {
                    customToast("ERROR", "Finish date must be at least 10 minutes in the future");
                    return;
                }
                
                // Format date exactly as required by the API
                const isoString = dateObj.toISOString();
                console.log("Submitting finish date:", isoString);
                
                // Set the date directly as a string value, not in FormData
                formData.set("finishDate", isoString);
            } catch (error) {
                console.error("Error formatting date:", error);
                customToast("ERROR", "Invalid date format");
                return;
            }
        } else {
            customToast("ERROR", "Finish date is required");
            return;
        }

        // Handle non-image, non-date form data
        Object.entries(values).forEach(([key, value]) => {
            // Skip finishDate and image as we handle them separately
            if (key === "finishDate" || key === "image") return;
            
            if (value !== undefined) {
                if (key === "subscribeChannels" || key === "sentChannels") {
                    if (Array.isArray(value) && value.some(channel => typeof channel === 'object' && channel.hasOwnProperty("createdAt"))) {
                        formData.append(key, JSON.stringify(value.map((channel: { id: any; }) => channel.id)));
                    } else {
                        formData.append(key, JSON.stringify(value));
                    }
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        // Handle image data with clear priority
        if (mediaData) {
            // Use the Media API data format that we confirmed is working
            formData.append("imageUrl", mediaData.imageUrl);
            formData.append("imageId", mediaData.imageId);
            formData.append("imageName", mediaData.imageName);
        } else if (data?.imageUrl && action === "EDIT") {
            // For edit mode, use existing image data if no new upload
            formData.append("imageUrl", data.imageUrl);
            formData.append("imageId", data.imageId || "");
            formData.append("imageName", data.imageName || "");
        }

        // Debugging output - log the entire FormData contents
        console.log("Form data entries:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Submit the form
        try {
            if (action === "CREATE") {
                createEventMutation.mutate(formData as unknown as CreateOrUpdateEventType);
            } else if (action === "EDIT") {
                updateEventMutation.mutate({
                    id: data?.id!,
                    data: formData as unknown as CreateOrUpdateEventType
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            customToast("ERROR", "Failed to submit the form");
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
                                        <DateTimePicker
                                            placeholder="Tugash sanasi va vaqtini tanlang"
                                            date={field.value}
                                            setDate={(date) => form.setValue("finishDate", date!, { shouldValidate: true })}
                                        />
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
                                            name={mediaData?.imageName || data?.imageName}
                                            image_url={mediaData?.imageUrl || field.value}
                                            onUploadSuccess={handleMediaUploadSuccess}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Active Status */}
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Status:</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            {field.value ? "Faol" : "Faol emas"}
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
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
