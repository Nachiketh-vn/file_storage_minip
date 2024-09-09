import DashboardMain from "./dashboard-main";
import LargeDashboardSidebar from "./dashboard-sidebar";

export default function DashboardLayout1() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <LargeDashboardSidebar />
      <DashboardMain />
    </div>
  );
}
