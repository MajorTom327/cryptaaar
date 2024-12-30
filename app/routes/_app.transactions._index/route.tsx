import { DateTime } from "luxon";
import { useLoaderData } from "react-router";
import { TransactionsService } from "~/.server/services/data/transactions-service";
import { preventNoWallet } from "~/.server/utils/prevent/prevent-no-wallet";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";
import { Route } from "./+types/route";
import { TransactionsTable } from "./components/transactions-table";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await preventNotConnected(request)!;
  const wallet = await preventNoWallet(user)!;

  const transactionsService = new TransactionsService();

  const chains = [
    SimpleHashChain.ethereum,
    SimpleHashChain.polygon,
    SimpleHashChain.base,
  ];

  const transactions = await Promise.all(
    chains.map((chain) => transactionsService.getTransaction(wallet!, chain))
  ).then((result) => {
    return result.flat().sort((a, b) => {
      const aTimestamp = DateTime.fromISO(a.metadata.blockTimestamp).toMillis();
      const bTimestamp = DateTime.fromISO(b.metadata.blockTimestamp).toMillis();

      return bTimestamp - aTimestamp;
    });
  });

  return {
    transactions,
  };
}

export const TransactionsRoute = () => {
  const { transactions } = useLoaderData<typeof loader>();

  return (
    <>
      <TransactionsTable transactions={transactions} />
    </>
  );
};

export default TransactionsRoute;
