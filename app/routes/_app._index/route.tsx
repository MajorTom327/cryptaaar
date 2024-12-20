import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { namedAction } from "remix-utils/named-action";
import { z } from "zod";
import { AddressesDao } from "~/.server/dao/addresses-dao";
import { ContractDao } from "~/.server/dao/contract-dao";
import { authenticator } from "~/.server/services/authenticator";
import { BalancesService as SimpleHashService } from "~/.server/services/simple-hash";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";
import { BalanceTable } from "./balance-table";
import { Favorites } from "./favorites";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

  const addressDao = new AddressesDao();

  const address = await addressDao.getMainAddress(user);
  if (!address) throw redirect("/addresses/add");

  const simpleHashService = new SimpleHashService(user);

  const balances = simpleHashService
    .getBalances(user.addresses.filter((a) => a !== undefined))
    .then((res) => res.fungibles);

  const contractDao = new ContractDao(user!);

  return {
    balances,
    favorites: await contractDao.getFavorites(),
  };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className={"flex flex-col gap-2"}>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.balances}>
          {(balances) => {
            const favoritesAddresses = data.favorites.map(
              (favorite) => favorite.chainId + "." + favorite.contractAddress
            );

            return (
              <Favorites
                balances={balances.filter((balance) =>
                  favoritesAddresses.includes(balance.fungible_id)
                )}
              />
            );
          }}
        </Await>
      </Suspense>

      <Suspense fallback={<div>Loading</div>}>
        <Await resolve={data.balances}>
          {(balances) => (
            <BalanceTable balances={balances} favorites={data.favorites} />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

  return namedAction(request, {
    async fav() {
      const input = await request.formData();

      const data = z
        .object({
          contractAddress: z.string(),
          chainId: z.nativeEnum(SimpleHashChain),
        })
        .parse(Object.fromEntries(input.entries()));

      const contractDao = new ContractDao(user!);

      await contractDao.toggleFavorite(data.contractAddress, data.chainId);

      return null;
    },
    async report() {
      const input = await request.formData();

      const data = z
        .object({
          contractAddress: z.string(),
          chainId: z.nativeEnum(SimpleHashChain),
        })
        .parse(Object.fromEntries(input.entries()));

      const contractDao = new ContractDao(user!);

      await contractDao.reportAsScam(data.contractAddress, data.chainId);

      return null;
    },
  });
}
