import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { QrCode, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function LoginRoute() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add a new address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant={"outline"}>
              <Link to="./keystone">
                <QrCode />
                Use AirGapped Wallet
              </Link>
            </Button>

            <Button asChild variant={"default"}>
              <Link to="./software">
                <Wallet />
                Use Metamask Wallet
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
