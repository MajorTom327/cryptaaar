import {
  AssetTransfersCategory,
  AssetTransfersWithMetadataResult,
  SortingOrder,
} from "alchemy-sdk";
import { z } from "zod";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";
import { Transaction, TransactionSchema } from "~/types/transactions";
import { AlchemyService } from "../alchemy-service";
import { CACHE_TTL_LONG, redis } from "../redis-service";

export class TransactionsService {
  async getTransaction(address: string, chain: SimpleHashChain) {
    const client = AlchemyService.getClient(chain);

    const cache_key = `transactions-${address}-${chain}`;

    if (!client) {
      return [];
    }

    return redis
      .get(cache_key)
      .then((result) => {
        if (result !== null) {
          return JSON.parse(result);
        }

        return Promise.allSettled([
          client.core.getAssetTransfers({
            fromAddress: address,
            category: [...Object.values(AssetTransfersCategory)],
            withMetadata: true,

            order: SortingOrder.DESCENDING,
          }),
          // client.core.getAssetTransfers({
          //   toAddress: address,
          //   category: [...Object.values(AssetTransfersCategory)],
          //   withMetadata: true,

          //   order: SortingOrder.DESCENDING,
          // }),
        ]).then((data) => {
          const transfers = data
            .filter((el) => el.status === "fulfilled")
            .reduce((acc, el) => {
              return acc.concat(el.value.transfers);
            }, [] as AssetTransfersWithMetadataResult[])
            .map((t) => ({
              ...t,
              chain: chain,
            }));

          return redis
            .setex(cache_key, CACHE_TTL_LONG, JSON.stringify(transfers))
            .then(() => transfers)
            .catch(() => transfers);
        });
      })
      .then((res): Array<Transaction> => {
        console.log(JSON.stringify(res, null, 2));
        const parsed = z.array(TransactionSchema).safeParse(res);

        if (!parsed.success) {
          console.log(JSON.stringify(parsed.error, null, 2));
          throw new Error("Failed to parse transactions");
        }
        return parsed.data;
      });
  }
}
