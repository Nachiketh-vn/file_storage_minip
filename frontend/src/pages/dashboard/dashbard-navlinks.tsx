import clsx from "clsx";
import { LuBuilding2, LuHome } from "react-icons/lu";
import { Link, useSearchParams } from "react-router-dom";

export default function DashboardNavLinks() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  console.log(view);

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <NavLinksItem
        Icon={LuHome}
        text="Personal Files"
        activeText="default"
        currentText={view}
        link="/app?view=default"
      />
      <NavLinksItem
        Icon={LuBuilding2}
        text="Organizations"
        activeText="org"
        currentText={view}
        link="/app?view=org"
      />
    </nav>
  );
}

function NavLinksItem({
  Icon,
  text,
  activeText,
  currentText,
  link,
}: {
  Icon: React.ComponentType<{ className: string }>;
  text: string;
  activeText: string;
  currentText: string | null;
  link: string;
}) {
  return (
    <Link
      to={link}
      className={clsx(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
        activeText === currentText
          ? "bg-muted text-primary"
          : "text-muted-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {text}
    </Link>
  );
}
