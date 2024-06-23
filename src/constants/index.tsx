import {AiOutlineDashboard} from "react-icons/ai";
import {MdOutlineEmojiEvents} from "react-icons/md";
import {PiTelegramLogoDuotone} from "react-icons/pi";

export const sidebarItems = [
    {
        id: 1,
        label: "Dashboard",
        href: "/",
        icon: <AiOutlineDashboard/>,
    },
    {
        id: 2,
        label: "Tanlovlar",
        href: "/events",
        icon: <MdOutlineEmojiEvents/>,
    },
    {
        id: 3,
        label: "Kanallar",
        href: "/channels",
        icon: <PiTelegramLogoDuotone/>,
    }
];

export const API_URLS = {
    LOCAL: "",
    DEVELOPMENT: "",
    PRODUCTION: "",
};
