import { Link } from "react-router-dom";

const InternalServerError = () => {
  const pathname_on_error = localStorage.getItem("pathname_on_error");

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen">
      <h1 className="text-xl text-black font-medium max-lg:text-center max-lg:text-xl max-lg:w-[90%]">
        Something went wrong! Try again later or click{" "}
        <span className="text-destructive">Refresh</span> button below!
      </h1>

      <Link
        to={pathname_on_error || "/"}
        className="px-3 py-1 bg-primary rounded-md text-white cursor-pointer"
      >
        Refresh
      </Link>
    </div>
  );
};

export default InternalServerError;
