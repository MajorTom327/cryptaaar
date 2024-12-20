import { BalanceCard } from "~/routes/_app._index/favorites/balance-card";
import { GetFungibleResponse } from "~/types/simple-hash/balances";

type Props = {
  balances: GetFungibleResponse[];
};

export const Favorites: React.FC<Props> = ({ balances }) => {
  console.log(balances);
  return (
    <div className={"grid grid-cols-2 gap-2"}>
      {balances.map((balance) => (
        <BalanceCard key={balance.fungible_id} balance={balance} />
      ))}
    </div>
  );
};
