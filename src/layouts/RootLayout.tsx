import { Outlet } from "react-router-dom";
import { Sidebar } from "../components";

const RootLayout = () => {
  return (
    <div className="flex gap-2 ">
      <Sidebar />

      <div className="w-full px-3 pt-4 pb-10 flex flex-col gap-3">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
