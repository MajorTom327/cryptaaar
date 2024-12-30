import { ColumnDef } from "@tanstack/react-table";
import { BigNumber } from "ethers";
import { DateTime } from "luxon";
import { ChainBadge } from "~/components/chain-badge";
import { BigNumberFormat } from "~/components/formatters";
import { AddressFormat } from "~/components/formatters/address-format";
import { DataTable } from "~/components/ui/data-table";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";
import { Transaction } from "~/types/transactions";

type Props = {
  transactions: Transaction[];
};

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "blockNum",
    header: "Block",
    cell: ({ row }) => {
      const blockNum = row.getValue<BigNumber>("blockNum");
      return (
        <>
          <BigNumberFormat value={blockNum} decimals={0} />
        </>
      );
    },
  },
  {
    accessorKey: "chain",
    header: "Chain",
    cell: ({ row }) => {
      const chain = row.getValue<SimpleHashChain>("chain");
      return <ChainBadge chain={chain} />;
    },
  },
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => {
      const from = row.getValue<string>("from");
      return <AddressFormat address={from} />;
    },
  },
  {
    accessorKey: "hash",
    header: "Hash",
    cell: ({ row }) => {
      const hash = row.getValue<string>("hash");
      return <AddressFormat address={hash} />;
    },
  },
  {
    accessorKey: "metadata.blockTimestamp",
    header: "Timestamp",
    cell: ({ cell }) => {
      const timestamp = DateTime.fromISO(cell.getValue<string>());

      console.log(timestamp, typeof timestamp);

      return (
        <>
          <div className="flex flex-col group relative h-16 items-center justify-center gap-2">
            <div className="transition transform group-hover:-translate-y-4 text-lg">
              {timestamp.toRelative()}
            </div>
            <div className="transition opacity-0 group-hover:opacity-100 flex absolute top-0 bottom-0 items-center pt-4">
              {timestamp.toLocaleString(DateTime.DATETIME_SHORT)}
            </div>
          </div>
        </>
      );
    },
  },
];

export const TransactionsTable = ({ transactions }: Props) => {
  return <DataTable columns={columns} data={transactions} />;
};
