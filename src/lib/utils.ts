import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import toastResponsive from "react-hot-toast";
import dateFormat from "dateformat";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const numberSpacer = (amount: number) => {
    return parseInt(String(amount), 10).toLocaleString().replace(/,/g, " ");
};

export const customToast = (type: "SUCCESS" | "ERROR", message: string) => {
    switch (type) {
        case "SUCCESS":
            toastResponsive.success(`${message}`, {
                duration: 2000,
            });
            break;
        case "ERROR":
            toastResponsive.error(`${message}`, {
                duration: 3000,
            });
            break;
        default:
            toastResponsive("Something went wrong!");
            break;
    }
};

export const dateFormatter = (date: string, includeTime: boolean = true) => {
    const paddedShortDate = dateFormat(date, "dd/mm/yyyy");
    const shortTime = dateFormat(date, "HH:MM");

    if (includeTime) {
        return `${paddedShortDate}, ${shortTime}`;
    } else {
        return `${paddedShortDate}`
    }
};

export const capitalizedText = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const wordSlicer = (word: string) => {
    return word.length <= 65 ? word : `${word.slice(0, 65)} ...`;
};
