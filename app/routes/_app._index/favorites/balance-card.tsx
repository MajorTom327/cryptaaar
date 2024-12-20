import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import NumberFlow from "@number-flow/react";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { NetworkFormat } from "~/components/formatters";
import { GetFungibleResponse } from "~/types/simple-hash/balances";

type Props = {
  balance: GetFungibleResponse;
};

export const BalanceCard = ({ balance }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {balance.name}
        </CardTitle>
        <CardDescription>
          <NetworkFormat network={balance.chain} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-3xl font-bold">
            <NumberFlow
              value={parseFloat(balance.total_value_usd_string ?? "0.0")}
            />
            {" USD"}
          </div>
          <div className="text-lg font-light">
            <NumberFlow
              value={parseFloat(
                formatUnits(
                  ethers.BigNumber.from(balance.total_quantity_string),
                  balance.decimals
                )
              )}
            />{" "}
            {balance.symbol}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
