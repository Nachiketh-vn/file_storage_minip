import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuMenu, LuSearch, LuUserCircle } from "react-icons/lu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import DashboardPopup from "./dashboard-popup";
import DashboardNavLinks from "./dashbard-navlinks";
import UploadFile from "@/components/upload-file";

export default function DashboardTopBar({
  searchText,
  setSearchText,
}: {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <LuMenu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <DashboardNavLinks />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <div className="relative">
          <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Files"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          />
        </div>
      </div>
      <UploadFile />
      <DashboardPopup
        TriggerElement={() => (
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <LuUserCircle className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
        )}
      />
    </header>
  );
}
