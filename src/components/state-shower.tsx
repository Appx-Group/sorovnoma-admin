const StateShower = ({
  id,
  name,
}: {
  id: "no_data" | "loading" | "error";
  name: string;
}) => {
  return (
    <div className="flex justify-center items-center h-[20vh] select-none">
      <h1 className={`${id !== "no_data" && "animate-bounce"} text-base`}>
        {name}
      </h1>
    </div>
  );
};

export default StateShower;
