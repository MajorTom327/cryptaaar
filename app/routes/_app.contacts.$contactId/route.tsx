import { useLoaderData } from "react-router";
import { BalancesService } from "~/.server/services/data";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { Route } from "./+types/route";
import { BalanceCard } from "./components/balance-card";

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await preventNotConnected(request);

  const contactId = params.contactId;

  const balanceService = new BalancesService(user!);
  const balances = await balanceService.getBalances(contactId.split(".")[1]);

  return {
    balances: balances.fungibles.filter((f) => f.total_quantity > 0),
  };
}

export const ContactRoute = () => {
  const { balances } = useLoaderData<typeof loader>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {balances.map((balance) => (
        <BalanceCard key={balance.fungible_id} balance={balance} />
      ))}

      {balances.length === 0 && (
        <div className="col-span-2">
          <div className="flex items-center justify-center min-h-48 text-muted-foreground">
            No balances found
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactRoute;
