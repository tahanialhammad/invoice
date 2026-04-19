interface DashboardHeaderProps {
    name: string;
    isAdmin: boolean;
}

export default function DashboardHeader({ name, isAdmin }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col gap-1 mb-2">
            <h1 className="text-3xl font-black tracking-tight text-sidebar-foreground">
                Dashboard Overview
            </h1>
            <p className="text-sidebar-foreground/60 font-medium">
                {isAdmin 
                    ? `Control Panel for Administrator: ${name}` 
                    : `Welcome back to your workspace, ${name}`}
            </p>
        </div>
    );
}
