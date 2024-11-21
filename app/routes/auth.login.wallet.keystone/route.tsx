import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export default function LoginKeystoneRoute() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Alert variant={"destructive"}>
          <AlertTitle>AirGapped Wallet not implemented yet</AlertTitle>
          <AlertDescription>
            <p>
              {"Please use a software wallet on "}
              <Link to={"/auth/login/wallet"} className="underline">
                Wallet Login Page
              </Link>
              .
            </p>
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant={"outline"}>
            <Link to="/auth/login">Back to login</Link>
          </Button>

          <Button asChild variant={"default"}>
            <Link to="/auth/login/wallet">Login with software wallet</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
