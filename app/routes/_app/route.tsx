import { Outlet } from "react-router";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { AppLayout } from "~/components/app-layout";
import type { Route } from "./+types/route";

export { ErrorBoundary } from "~/components/error-boundary";

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
