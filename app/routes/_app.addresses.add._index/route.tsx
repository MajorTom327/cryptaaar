import { Usb, Wallet } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
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
              <Link to="./hardware">
                <Usb />
                Hardware Wallet
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
