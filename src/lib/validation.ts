import * as z from "zod";

export const LoginSchema = z.object({
    username: z
        .string({
            required_error: "username is required!",
        })
        .min(1, "username is required!"),
    password: z
        .string({
            required_error: "password is required!",
        })
        .min(1, "password is required!"),
});

export const CandidateSchema = z.object({
    name: z
        .string({
            required_error: "Ism bo'sh bo'lmasligi kerak!",
            invalid_type_error: "Ism bo'sh bo'lmasligi kerak!",
        })
        .min(1, "Ism bo'sh bo'lmasligi kerak!")
});

export const EventSchema = z.object({
    name: z
        .string({
            required_error: "Nomi bo'sh bo'lmasligi kerak!",
            invalid_type_error: "Nomi bo'sh bo'lmasligi kerak!"
        })
        .min(1, "Nomi bo'sh bo'lmasligi kerak!"),
    descr: z.string().optional(),
    finishDate: z
        .date({
            required_error: "Tugash sanasi kiritilishi kerak!",
            invalid_type_error: "Noto'g'ri sana formati!"
        })
        .refine((date) => {
            const minTime = new Date(new Date().getTime() + 10 * 60 * 1000); // 10 minutes from now
            return date > minTime;
        }, "Sana kamida 10 daqiqa kelajakda bo'lishi kerak"),
    isActive: z.boolean().optional().default(true),
    image: z.any({
        required_error: "muqova rasmi bo'sh bo'lmasligi kerak!",
        invalid_type_error: "muqova rasmi bo'sh bo'lmasligi kerak!",
    }).optional(),
    subscribeChannels: z.any().array().optional(),
    sentChannels: z.any().optional(),
});

export const ChannelSchema = z.object({
    id: z.string({
        required_error: "id bo'sh bo'lmasligi kerak!",
        invalid_type_error: "id bo'sh bo'lmasligi kerak!"
    }).min(1, "id bo'sh bo'lmasligi kerak!"),
    name: z.string({
        required_error: "kanal nomi bo'sh bo'lmasligi kerak!",
        invalid_type_error: "kanal nomi bo'sh bo'lmasligi kerak!"
    }).min(1, "kanal nomi bo'sh bo'lmasligi kerak!"),
    link: z.string({
        required_error: "link bo'sh bo'lmasligi kerak!",
        invalid_type_error: "link bo'sh bo'lmasligi kerak!"
    }).min(1, "link bo'sh bo'lmasligi kerak!"),
});
