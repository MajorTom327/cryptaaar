import { Outlet } from "react-router";
import bgImage from "./assets/background.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const AuthLayout = () => {
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <div
        className="fixed -top-1 -right-1 -bottom-1 -left-1 z-10 bg-center bg-cover bg-no-repeat blur-sm"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="absolute inset-0 bg-white opacity-25"></div>
      </div>
      <div className="z-20 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <div className="-mt-48 w-4/5 h-full grid lg:grid-cols-2 gap-2 items-center justify-center">
          <Card className={"lg:col-start-2"}>
            <CardHeader className={"flex-col items-center gap-2"}>
              <CardTitle>Connect to Cryptaaar</CardTitle>
            </CardHeader>
            <CardContent>
              <Outlet />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
