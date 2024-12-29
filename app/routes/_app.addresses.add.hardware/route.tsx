import { ClientOnly } from "remix-utils/client-only";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { Route } from "./+types/route";
import { KeystoneConnect } from "./components/keystone-connect";
export { ErrorBoundary } from "~/components/error-boundary";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await preventNotConnected(request);

  return null;
}

export const AddHardwareWalletPage = () => {
  return (
    <div>
      <ClientOnly>{() => <KeystoneConnect />}</ClientOnly>
    </div>
  );
};

export default AddHardwareWalletPage;
