import { FC } from "react";
import { Outlet } from "@remix-run/react";
import { AppLayout } from "~/components/app-layout";
import { authenticator } from "~/.server/services/authenticator";
import { LoaderFunctionArgs } from "@remix-run/node";

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
