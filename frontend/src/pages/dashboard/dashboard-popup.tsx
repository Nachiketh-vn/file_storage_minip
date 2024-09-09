import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

export default function DashboardPopup({
  TriggerElement,
}: {
  TriggerElement: React.ComponentType;
}) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <TriggerElement />
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
          className="w-full text-left cursor-default"
            onClick={() => {
              signOut();
              navigate("/");
            }}
          >
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
