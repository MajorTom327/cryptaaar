import { Balance } from "~/.server/services/blockchain/balance-service";
import { BalanceCard } from "~/routes/_app._index/favorites/balance-card";

type Props = {
  balances: Balance[];
};

export const Favorites: React.FC<Props> = ({ balances }) => {
  return (
    <div className={"grid grid-cols-2 gap-2"}>
      {balances.map((balance) => (
        <BalanceCard key={balance.contractAddress} balance={balance} />
      ))}
    </div>
  );
};
