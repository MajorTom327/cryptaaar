import NumberFlow from "@number-flow/react";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { GetFungibleResponse } from "~/types/simple-hash/balances";

type Props = {
  balance: GetFungibleResponse;
};

export const BalanceCard: React.FC<Props> = ({ balance }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{balance.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-0 w-full">
            <div className="text-4xl">
              <NumberFlow
                value={parseFloat(balance.total_value_usd_string ?? "0.0")}
              />
              {" USD"}
            </div>
            <div className="text-sm text-muted-foreground">
              <NumberFlow
                value={parseFloat(
                  formatUnits(
                    ethers.BigNumber.from(balance.total_quantity_string),
                    balance.decimals
                  )
                )}
              />
              {` ${balance.symbol}`}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
