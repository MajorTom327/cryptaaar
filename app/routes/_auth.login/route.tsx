import { Outlet } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const AuthLoginLayout = () => {
  return (
    <div className="-mt-48 w-4/5 h-full grid lg:grid-cols-2 gap-2 items-center justify-center">
      <Card className={"lg:col-start-2 "}>
        <CardHeader className={"flex-col items-center gap-2"}>
          {/*<img src={logo} alt="CharityCrowd Logo" className="w-24" />*/}
          <CardTitle>Connect to Cryptaaar</CardTitle>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLoginLayout;
