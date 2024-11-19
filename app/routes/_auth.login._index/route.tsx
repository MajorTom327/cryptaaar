import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { QrCode, Wallet } from "lucide-react";

export default function LoginRoute() {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button asChild variant={"outline"}>
          <Link to="/login/keystone">
            <QrCode />
            Use AirGapped Wallet
          </Link>
        </Button>

        <Button asChild variant={"default"}>
          <Link to="/login/wallet">
            <Wallet />
            Use Metamask Wallet
          </Link>
        </Button>
      </div>
    </>
  );
}
