import { Link } from "@remix-run/react";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Button } from "../ui/button";

type Props = {};

export const AppNavbar: React.FC<Props> = () => {
  return (
    <div className="flex w-full justify-between items-center gap-4 px-4 py-2 border-b bg-secondary grow">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Button asChild variant={"ghost"}>
          <Link to={"/"}>Cryptaaar</Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button asChild variant={"ghost"}>
          <Link to={"/"}>Home</Link>
        </Button>
        <Button asChild variant={"ghost"}>
          <Link to={"/"}>About</Link>
        </Button>
      </div>
    </div>
  );
};
