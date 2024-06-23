export type LoginAdminProps = {
    username: string;
    password: string;
};

export type DashboardType = {
    events: number,
    candidates: number,
    votes: number,
    users: number
}