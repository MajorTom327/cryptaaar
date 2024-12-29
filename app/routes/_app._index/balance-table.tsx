import NumberFlow from "@number-flow/react";
import { Form, Link, useFetcher } from "react-router";
import { ColumnDef } from "@tanstack/react-table";
import { BigNumber } from "alchemy-sdk";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import {
  ArrowRightLeft,
  Clipboard,
  ExternalLink,
  Flag,
  MoreHorizontal,
  Search,
  Send,
  Star,
} from "lucide-react";
import { useState } from "react";
import { ChainBadge } from "~/components/chain-badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import {
  GetAddressBalanceResponse,
  GetFungibleResponse,
} from "~/types/simple-hash/balances";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";

type Props = {
  balances: GetFungibleResponse[];
  favorites: { contractAddress: string; chainId: SimpleHashChain }[];
};

const FavButton: React.FC<{
  balance: GetFungibleResponse;
  isFavorite: boolean;
}> = ({ balance, isFavorite }) => {
  const fetcher = useFetcher();

  const isFav = isFavorite;

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("contractAddress", balance.fungible_id.split(".")[1]);
    formData.append("chainId", balance.chain);
    fetcher.submit(formData, { method: "POST", action: "/?index&action=fav" });
  };

  return (
    <Button variant="ghost" size={"icon"} onClick={onSubmit}>
      <Star className={cn({ "fill-amber-400 stroke-amber-500": isFav })} />
    </Button>
  );
};

const columns: ColumnDef<GetFungibleResponse & { isFavorite: boolean }>[] = [
  {
    accessorKey: "isFavorite",
    header: "Fav",
    cell: ({ row, cell }) => (
      <FavButton balance={row.original} isFavorite={cell.getValue<boolean>()} />
    ),
  },
  {
    accessorKey: "chain",
    header: "Chain",
    cell: ({ cell }) => {
      const chain = cell.getValue<SimpleHashChain>();
      return <ChainBadge chain={chain} />;
    },
  },
  { accessorKey: "name", header: "Name" },
  {
    header: "Symbol",
    cell: ({ row }) => {
      const metadata = row.original;

      return <div className="flex items-center gap-2">{metadata.symbol}</div>;
    },
  },
  {
    id: "balance",
    accessorKey: "queried_wallet_balances",
    header: "Balance",
    cell: ({ cell, row }) => {
      const balances = cell.getValue<GetAddressBalanceResponse[]>();
      const decimals = row.original.decimals;

      return (
        <div className="flex flex-col gap-2">
          {balances.map((balance) => (
            <div key={balance.address} className="flex justify-between">
              <NumberFlow
                value={parseFloat(
                  formatUnits(
                    ethers.BigNumber.from(balance.quantity_string),
                    decimals
                  )
                )}
              />
              <div>
                <NumberFlow
                  value={parseFloat(balance.value_usd_string ?? "0.0")}
                />
                {" USD"}
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "fungible_id",
    header: "Actions",
    cell: ({ row }) => {
      const contract = row.original.fungible_id.split(".")[1];

      const balances = row.original.queried_wallet_balances.map((b) =>
        BigNumber.from(b.quantity_string ?? "0")
      );

      const haveBalance = balances.some((b) => !b.isZero());
      const chainId = row.getValue<SimpleHashChain>("chain");

      const assetId = row.original.fungible_id;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Transaction</DropdownMenuLabel>
              <DropdownMenuItem disabled={!haveBalance}>
                <Send />
                <span>Transfer</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArrowRightLeft />
                <span>Swap</span>
              </DropdownMenuItem>

              <DropdownMenuLabel>Asset</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to={`/assets/${assetId}`}>
                  <Search />
                  <span>View asset</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(contract)}
              >
                <Clipboard />
                <span>Copy contract address</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <ExternalLink />
                <span>Open in explorer</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Form method="post" action="/?index&action=report">
                <input type="hidden" name="contractAddress" value={contract} />
                <input type="hidden" name="chainId" value={chainId} />
                <DropdownMenuItem asChild variant={"destructive"}>
                  <button type="submit">
                    <Flag />
                    <span>Mark contract as Scam</span>
                  </button>
                </DropdownMenuItem>
              </Form>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export const BalanceTable: React.FC<Props> = ({ balances, favorites }) => {
  const favs = favorites.map((fav) => fav.chainId + "." + fav.contractAddress);

  const [hideEmpty, setHideEmpty] = useState(false);

  const balancesWithFavorites = balances
    .filter((balance) => {
      if (hideEmpty) {
        return balance.queried_wallet_balances.some((qb) => qb.quantity > 0);
      }
      return true;
    })
    .map((balance) => {
      const balanceId = balance.fungible_id;
      return {
        ...balance,
        isFavorite: favs.includes(balanceId),
      };
    });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balances</CardTitle>
        <CardDescription>
          <Button
            size="sm"
            variant={hideEmpty ? "default" : "outline"}
            onClick={() => setHideEmpty(!hideEmpty)}
          >
            Hide empty
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={balancesWithFavorites} />
      </CardContent>
    </Card>
  );
};
