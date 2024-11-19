import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import type { BalanceWithMetadata } from "~/.server/services/blockchain/balance-service";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import NumberFlow from "@number-flow/react";
import { NetworkFormat } from "~/components/formatters";

type Props = {
  balance: BalanceWithMetadata;
};

export const BalanceCard = ({ balance }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {balance.metadata.logo && (
            <img
              className={"w-6"}
              alt={balance.metadata.name + "'s logo"}
              src={balance.metadata.logo}
            />
          )}
          {balance.metadata.name}
        </CardTitle>
        <CardDescription>
          <NetworkFormat network={balance.chainId} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NumberFlow
          value={parseFloat(
            formatUnits(
              ethers.BigNumber.from(balance.tokenBalance),
              balance.metadata.decimals,
            ),
          )}
        />
      </CardContent>
    </Card>
  );
};
