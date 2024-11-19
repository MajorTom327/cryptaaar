import { Outlet } from "@remix-run/react";
import bgImage from "./assets/background.jpg";

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
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
