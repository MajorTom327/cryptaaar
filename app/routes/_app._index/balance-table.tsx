import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Balance,
  BalanceWithMetadata,
  ContractMetadata,
} from "~/.server/services/blockchain/balance-service";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { Link, useFetcher } from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
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
import { cn } from "~/lib/utils";
import { BigNumberToFormat, NetworkFormat } from "~/components/formatters";
import { BigNumber, Network } from "alchemy-sdk";
import NumberFlow from "@number-flow/react";
import { BigNumberish } from "ethers";

type Props = {
  balances: BalanceWithMetadata[];
  favorites: { contractAddress: string; chainId: Network }[];
};

const FavButton: React.FC<{
  balance: BalanceWithMetadata;
  isFavorite: boolean;
}> = ({ balance, isFavorite }) => {
  const fetcher = useFetcher();

  const isFav = isFavorite;

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("contractAddress", balance.contractAddress);
    formData.append("chainId", balance.chainId);
    fetcher.submit(formData, { method: "POST", action: "/?index&action=fav" });
  };

  return (
    <Button variant="ghost" size={"icon"} onClick={onSubmit}>
      <Star className={cn({ "fill-amber-400 stroke-amber-500": isFav })} />
    </Button>
  );
};

const columns: ColumnDef<BalanceWithMetadata & { isFavorite: boolean }>[] = [
  {
    accessorKey: "isFavorite",
    header: "Fav",
    cell: ({ row, cell }) => (
      <FavButton balance={row.original} isFavorite={cell.getValue<boolean>()} />
    ),
  },
  {
    accessorKey: "chainId",
    header: "Chain",
    cell: ({ cell }) => <NetworkFormat network={cell.getValue<Network>()} />,
  },
  { accessorKey: "metadata.name", header: "Name" },
  {
    accessorKey: "metadata",
    header: "Symbol",
    cell: ({ cell }) => {
      const metadata = cell.getValue<ContractMetadata>();

      return (
        <div className="flex items-center gap-2">
          {metadata.logo && (
            <img
              alt={`${metadata.name} logo`}
              src={metadata.logo}
              className="w-6 h-6"
            />
          )}
          {metadata.symbol}
        </div>
      );
    },
  },
  {
    id: "balance",
    accessorKey: "tokenBalance",
    header: "Balance",
    cell: ({ cell }) => {
      const balance = cell.getValue<BigNumberish>();
      return <NumberFlow value={parseFloat(BigNumberToFormat(balance))} />;
    },
  },
  {
    accessorKey: "contractAddress",
    header: "Actions",
    cell: ({ cell, row }) => {
      const contract = cell.getValue<string>();

      const balance = BigNumber.from(row.getValue<BigNumberish>("balance"));
      const chainId = row.getValue<Network>("chainId");

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
              <DropdownMenuItem disabled={balance.isZero()}>
                <Send />
                <span>Transfer</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArrowRightLeft />
                <span>Swap</span>
              </DropdownMenuItem>

              <DropdownMenuLabel>Asset</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to={`/assets/${chainId}/${contract}`}>
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
              <DropdownMenuItem variant={"destructive"}>
                <Flag />
                <span>Mark contract as Scam</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];

export const BalanceTable: React.FC<Props> = ({ balances, favorites }) => {
  const favs = favorites.map((fav) => fav.chainId + "#" + fav.contractAddress);
  const balancesWithFavorites = balances.map((balance) => {
    const balanceId = balance.chainId + "#" + balance.contractAddress;
    return {
      ...balance,
      isFavorite: favs.includes(balanceId),
    };
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={balancesWithFavorites} />
      </CardContent>
    </Card>
  );
};
