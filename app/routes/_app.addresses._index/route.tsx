import { LoaderFunctionArgs, redirect } from "react-router";
import { Link, useLoaderData } from "react-router";
import { Plus } from "lucide-react";
import { AddressesDao } from "~/.server/dao/addresses-dao";
import { authenticator } from "~/.server/services/authenticator";
import { EnsService } from "~/.server/services/simple-hash/ens-service";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AddressList } from "./address-list";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

  const addressesDao = new AddressesDao();

  const addresses = await addressesDao.getAddresses(user!);
  const ensService = new EnsService(user);
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

  console.log(data);
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
