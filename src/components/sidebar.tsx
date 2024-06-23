import { Link, useLocation, useNavigate } from "react-router-dom";
import { sidebarItems } from "../constants";

import { CiLogout } from "react-icons/ci";

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    const isOk = window.confirm("Are you sure?");
    if (isOk) {
      localStorage.clear();
      return navigate("/auth");
    }
  };

  return (
    <div className="bg-white pl-4 pr-7 pb-4 pt-7 w-64 h-screen left-0 top-0 sticky duration-500 shadow-md flex flex-col justify-between">
      <div className="flex flex-col gap-5">
        <div className={"flex justify-between"}>
          <Link to="/" className={"text-[20px] font-semibold"}>
            Admin Panel
          </Link>
        </div>

        <ul className="flex flex-col gap-1">
          {sidebarItems.map((elem) => {
            const isActive = pathname === elem.href;

            return (
              <Link
                key={elem.id}
                to={elem.href}
                className={`flex py-1 items-center gap-2 text-base ${
                  isActive && "text-primary rounded-md font-semibold"
                }`}
              >
                <span className="text-xl">{elem.icon}</span>
                <li>{elem.label}</li>
              </Link>
            );
          })}
        </ul>
      </div>

      <div
        className="text-destructive flex items-center gap-2 px-2 py-[5px] font-medium cursor-pointer hover:bg-destructive hover:text-white hover:rounded-md"
        onClick={handleLogout}
      >
        <CiLogout className="text-[22px]" />
        <span>Log Out</span>
      </div>
    </div>
  );
};

export default Sidebar;
