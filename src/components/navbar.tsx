const Navbar = ({
  name,
  breadcrumb,
}: {
  name: string;
  breadcrumb?: string;
}) => {
  return (
    <>
      <div
        className={
          "flex justify-between items-center shadow rounded-sm bg-white p-3"
        }
      >
        <div className="flex flex-col gap-[2px]">
          <h1 className={"text-base font-medium"}>{name}</h1>
          {breadcrumb && (
            <span className="text-xs font-normal">{breadcrumb}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
