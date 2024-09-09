import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LuBell, LuPackage2, LuUserCircle } from "react-icons/lu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import DashboardPopup from "./dashboard-popup";
import DashboardNavLinks from "./dashbard-navlinks";
import { useAuth } from "@/context/auth-context";

export default function LargeDashboardSidebar() {
  const { user } = useAuth();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <LuPackage2 className="h-6 w-6" />
            <span className="">Storage IO</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <LuBell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <DashboardNavLinks />
        </div>
        <div className="mt-auto p-4">
          <DashboardPopup
            TriggerElement={() => (
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="flex w-full justify-start gap-x-2"
                >
                  <LuUserCircle className="h-5 w-5" />
                  <span>{user?.user_metadata.name}</span>
                </Button>
              </DropdownMenuTrigger>
            )}
          />
        </div>
      </div>
    </div>
  );
}
