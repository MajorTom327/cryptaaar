import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useRouteError } from "@remix-run/react";
import { propOr } from "rambda";
import { FC } from "react";
import { authenticator } from "~/.server/services/authenticator";
import { AppLayout } from "~/components/app-layout";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });
  return null;
}

export const Page: FC = () => {
  return (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </>
  );
};

export default Page;

export const ErrorBoundary = () => {
  const error = useRouteError();
  console.log("error", error);
  return <div>Error {propOr(500, "status", error)}</div>;
};
