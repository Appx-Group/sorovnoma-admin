/* eslint-disable @typescript-eslint/no-explicit-any */
import {LoginAdminProps} from "@/types";
import {api} from "../configs";

class Admin {
    login = async (data: LoginAdminProps) => {
        return await api.post("/admin/auth/login", data);
    };
    getDashboard = async () => {
        return await api.get("/admin/dashboard");
    };
   
}

export const adminService = new Admin();
