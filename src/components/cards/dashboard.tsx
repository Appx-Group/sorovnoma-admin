import { numberSpacer } from "../../lib/utils";

type dashboardProps = {
  name: string;
  value: string | number;
};

const DashboardCard = ({ ...data }: dashboardProps) => {
  if (typeof data.value === "number") {
    data.value = numberSpacer(data.value);
  }

  return (
    <div className="flex flex-col items-center bg-white border rounded-sm shadow-sm px-2 py-4 ">
      <p className="text-base font-medium">{data.value || 0}</p>
      <h3 className="text-xs tracking-wider">{data.name || "not-given"}</h3>
    </div>
  );
};

export default DashboardCard;
