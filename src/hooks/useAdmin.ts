/* eslint-disable @typescript-eslint/no-explicit-any */
import {useMutation, useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {queryKeys} from "./queryKeys";
import {LoginAdminProps} from "@/types";
import {adminService} from "@/services/api";
import {customToast} from "@/lib/utils";

export const useAdminLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationKey: [queryKeys.LOGIN],
        mutationFn: (data: LoginAdminProps) => {
            return adminService.login(data);
        },
        onSuccess(res) {
            localStorage.setItem("accessToken", res.data?.accessToken);
            localStorage.setItem("refreshToken", res.data?.refreshToken);
            customToast("SUCCESS", "Successfully logged in!");
            navigate("/");
        },
        onError(error: any) {
            console.log(error);
            customToast(
                "ERROR",
                error?.response?.data?.message || "Error while logging in to account!"
            );
        },
    });
};

export const useGetDashboard = () => {
    return useQuery({
        queryKey: [queryKeys.GET_DASHBOARD],
        queryFn: () => {
            return adminService.getDashboard();
        },
        refetchOnWindowFocus: false,
    });
};
