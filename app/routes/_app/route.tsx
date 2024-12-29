import { propOr } from "rambda";
import { Outlet, useRouteError } from "react-router";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { AppLayout } from "~/components/app-layout";
import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  await preventNotConnected(request);
  return null;
}

export const Page: React.FC = () => {
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
