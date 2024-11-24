import { AlchemyService } from "~/.server/services/alchemy-service";
import { CACHE_TTL_LONG, CACHE_TTL_SHORT, redis } from "../redis-service";
import { z } from "zod";
import { BigNumberSchema } from "~/lib/schemas/BigNumberSchema";
import { Network } from "alchemy-sdk";
import { isNil } from "rambda";
import { ContractDao } from "~/.server/dao/contract-dao";
import { User } from "~/types";

const contractMetadataSchema = z.object({
  decimals: z.number(),
  logo: z.string().nullable(),
  name: z.string(),
  symbol: z.string(),
});

export type ContractMetadata = z.infer<typeof contractMetadataSchema>;

const balanceSchema = z.object({
  chainId: z.nativeEnum(Network),
  contractAddress: z.string(),
  tokenBalance: BigNumberSchema,
});

export type Balance = z.infer<typeof balanceSchema>;
export type BalanceWithMetadata = Balance & { metadata: ContractMetadata };

const balancesSchema = z.array(balanceSchema);

export class BalanceService {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  getBalanceForNetwork(
    address: string,
    network = Network.ETH_MAINNET,
  ): Promise<Balance[]> {
    const cacheKey = `${address}:balance:${network}`;

    const client = AlchemyService.getClient(network);

    return redis.get(cacheKey).then(async (balance): Promise<Balance[]> => {
      if (balance) {
        return balancesSchema.parse(JSON.parse(balance));
      }
      const balances = await client.core
        .getTokenBalances(address)
        .then((balances) => {
          return balances.tokenBalances
            .map((balance) => ({
              chainId: network,
              ...balance,
            }))
            .filter((balance) => isNil(balance.error));
        })
        .catch((e: unknown) => {
          console.log(`Error fetching balance ${address} on ${network}`);
          return [];
        });

      const data = balancesSchema.parse(balances);
      return redis
        .setex(cacheKey, CACHE_TTL_SHORT, JSON.stringify(data))
        .then(() => data)
        .catch(() => data);
    });
  }

  async getBalance(address: string): Promise<Balance[]> {
    const networks = AlchemyService.getNetworks();
    const contractDao = new ContractDao(this.user);

    const reports = await contractDao.getScamReports();

    return Promise.all(
      networks.map((network) => {
        return this.getBalanceForNetwork(address, network);
      }),
    )
      .then((balances) => {
        return balances.flat();
      })
      .then(async (balances) => {
        console.log(reports);

        return balances.filter((balance) => {
          return (
            reports.findIndex(
              (report) =>
                report.contractAddress === balance.contractAddress &&
                report.chainId === balance.chainId,
            ) === -1
          );
        });
      });
  }

  getContractMetadata(
    address: string,
    network: Network = Network.ETH_MAINNET,
  ): Promise<ContractMetadata> {
    const cacheKey = `${network}:contract:${address}:metadata`;

    return redis.get(cacheKey).then(async (metadata) => {
      if (metadata) {
        return contractMetadataSchema.parse(JSON.parse(metadata));
      }

      const client = AlchemyService.getClient(network);

      return client.core.getTokenMetadata(address).then((data) => {
        const metadata = contractMetadataSchema.parse(data);
        console.log("Contract metadata cache miss");

        return redis
          .setex(cacheKey, CACHE_TTL_LONG, JSON.stringify(metadata))
          .then(() => metadata)
          .catch(() => metadata);
      });
    });
  }
}
