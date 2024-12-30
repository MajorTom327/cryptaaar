import { Plus } from "lucide-react";
import { Link, redirect, useLoaderData } from "react-router";
import { AddressesDao } from "~/.server/dao/addresses-dao";
import { EnsService } from "~/.server/services/data/ens-service";
import { preventNoWallet } from "~/.server/utils/prevent/prevent-no-wallet";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types/route";
import { AddressList } from "./address-list";
export { ErrorBoundary } from "~/components/error-boundary";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await preventNotConnected(request);

  await preventNoWallet(user);
  const addressesDao = new AddressesDao();

  const addresses = await addressesDao.getAddresses(user!);
  const ensService = new EnsService(user!);
  const ens = await ensService.getEnsForAddress(
    addresses.map((a) => a.address)
  );
  if (addresses.length === 0) {
    throw redirect("/addresses/add");
  }

  return {
    addresses: addresses.map((a) => ({
      ...a,
      ens: ens.find((e) => e.address === a.address)?.ens ?? null,
    })),
  };
}

export const AddressesIndexRoute = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className={"flex items-center justify-between"}>
            Addresses
            <Button asChild variant={"ghost"} size={"icon"}>
              <Link to={"/addresses/add"}>
                <Plus />
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddressList addresses={data.addresses} />
        </CardContent>
      </Card>
    </>
  );
};

export default AddressesIndexRoute;
