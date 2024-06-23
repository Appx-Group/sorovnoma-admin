import React from "react";
import {Navigate} from "react-router-dom";

export const AuthChecker = ({children}: { children: React.ReactElement }) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        return <Navigate to="/auth" replace={true}/>;
    }

    return <>{children}</>;
};
