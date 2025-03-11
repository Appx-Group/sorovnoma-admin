import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import toastResponsive from "react-hot-toast";
import dateFormat from "dateformat";
import CryptoJS from "crypto-js";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const numberSpacer = (amount: number) => {
    return parseInt(String(amount), 10).toLocaleString().replace(/,/g, " ");
};

export const customToast = (type: string, message: string) => {
    switch (type) {
        case "SUCCESS":
            toastResponsive.success(message, {duration: 1500});
            break;
        case "ERROR":
            toastResponsive.error(message, {duration: 1500});
            break;
        case "DEFAULT":
            toastResponsive(message, {duration: 1500});
            break;
        case "LOADING":
            toastResponsive.loading(message, {duration: 1500});
            break;
        case "CUSTOM":
            toastResponsive.custom(message, {duration: 1500});
            break;
        default:
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

/**
 * Generates an authentication key for the Media API
 * @returns The encrypted authentication key
 */
export const generateMediaAuthKey = () => {
    // Use the exact environment variables from the original implementation 
    const client = import.meta.env.VITE_IMAGE_UPLOAD_CLIENT;
    const secret = import.meta.env.VITE_IMAGE_UPLOAD_SECRET;
    const key = import.meta.env.VITE_IMAGE_UPLOAD_KEY;

    const payload = {
        client,
        secret,
        time: Date.now(),
    };

    try {
        // Use the exact same CryptoJS approach with minimal manipulation
        const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(payload),
            key
        ).toString();
        
        return encrypted;
    } catch (error) {
        console.error("Error generating auth key:", error);
        throw error;
    }
};
