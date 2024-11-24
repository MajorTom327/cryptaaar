import { Await, useLoaderData } from "@remix-run/react";
import {
  BalanceService,
  BalanceWithMetadata,
} from "~/.server/services/blockchain/balance-service";
import { BalanceTable } from "./balance-table";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Favorites } from "./favorites";
import { authenticator } from "~/.server/services/authenticator";
import { namedAction } from "remix-utils/named-action";
import { z } from "zod";
import { Network } from "alchemy-sdk";
import { ContractDao } from "~/.server/dao/contract-dao";
import { Suspense } from "react";
import { AddressesDao } from "~/.server/dao/addresses-dao";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

  const addressDao = new AddressesDao();

  const address = await addressDao.getMainAddress(user);
  if (!address) throw redirect("/addresses/add");

  const balanceService = new BalanceService(user);
  const balances = await balanceService
    .getBalance(address)
    .then((balances) => {
      return balances.sort((a, b) => {
        if (b.tokenBalance.lt(a.tokenBalance)) return -1;
        if (a.tokenBalance.lt(b.tokenBalance)) return 1;
        return 0;
      });
    })
    .then((balances) =>
      Promise.all(
        balances.map(async (balance) => {
          const metadata = await balanceService.getContractMetadata(
            balance.contractAddress,
            balance.chainId,
          );
          return { ...balance, metadata };
        }),
      ),
    );

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
        <Await resolve={data.favorites}>
          {(favorites) => {
            const favoritesAddresses = favorites.map(
              (favorite) => favorite.chainId + "#" + favorite.contractAddress,
            );
            return (
              <Favorites
                balances={data.balances.filter((balance) =>
                  favoritesAddresses.includes(
                    balance.chainId + "#" + balance.contractAddress,
                  ),
                )}
              />
            );
          }}
        </Await>
      </Suspense>

      <BalanceTable
        balances={data.balances as unknown as BalanceWithMetadata[]}
        favorites={data.favorites}
      />
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
          chainId: z.nativeEnum(Network),
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
          chainId: z.nativeEnum(Network),
        })
        .parse(Object.fromEntries(input.entries()));

      const contractDao = new ContractDao(user!);

      await contractDao.reportAsScam(data.contractAddress, data.chainId);

      return null;
    },
  });
}
