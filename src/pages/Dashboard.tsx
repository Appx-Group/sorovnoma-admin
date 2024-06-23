import {Navbar} from "../components";
import {DashboardCard} from "../components/cards";
import {useGetDashboard} from "@/hooks";
import {DashboardType} from "@/types";

const Dashboard = () => {
    const getDashboardQuery = useGetDashboard()
    const dashboardData: DashboardType = getDashboardQuery.data?.data?.stats

    return (
        <>
            <Navbar name="Dashboard"/>

            <div className="grid grid-cols-7 max-lg:grid-cols-3 gap-4">
                <DashboardCard name="Tanlovlar" value={dashboardData?.events || 0}/>
                <DashboardCard name="Nomzodlar" value={dashboardData?.candidates || 0}/>
                <DashboardCard name="Ovozlar" value={dashboardData?.votes || 0}/>
                <DashboardCard name="Userlar" value={dashboardData?.users || 0}/>
            </div>
        </>
    );
};

export default Dashboard;
