import { Usb, Wallet } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
export { ErrorBoundary } from "~/components/error-boundary";

export default function AddressAddIndexRoute() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add a new address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant={"outline"} disabled title="Coming soon">
              {/* <Link to="./hardware"> */}
              <Usb />
              Hardware Wallet
              {/* </Link> */}
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
