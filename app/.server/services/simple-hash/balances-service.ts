import { getLogger } from "@logtape/logtape";
import { propOr } from "rambda";
import { z } from "zod";
import { ContractDao } from "~/.server/dao/contract-dao";
import {
  GetBalanceResponse,
  GetBalanceResponseSchema,
  GetNativeTokenResponse,
  NativeTokenSchema,
  nativeTokenToFungible,
} from "../../../types/simple-hash/balances";
import { SimpleHashChain } from "../../../types/simple-hash/sh-chains";
import { CACHE_TTL_SHORT, redis } from "../redis-service";
import { SimpleHashService } from "./simple-hash";

export class BalancesService extends SimpleHashService {
  async getBalances(address: string | string[]) {
    const sortedAddress = Array.isArray(address)
      ? address.sort((a, b) => a.localeCompare(b))
      : [address];
    const cacheKey = `${sortedAddress.join(",")}:balance`;
    const logger = getLogger(["cryptaaar", "balances-service"]);
    const contractDao = new ContractDao(this.user);

    const reports = await contractDao.getScamReports();

    return redis
      .get(cacheKey)
      .then(async (balance): Promise<GetBalanceResponse> => {
        if (balance) {
          logger.info("Cache hit");
          return GetBalanceResponseSchema.parse(JSON.parse(balance));
        }

        return this.get<GetBalanceResponse>({
          path: "/api/v0/fungibles/balances",
          query: {
            chains: Object.values(SimpleHashChain).join(","),
            wallet_addresses: sortedAddress.join(","),
            include_prices: 1,
            include_native_tokens: 1,
          },
        }).then((res) => {
          const native_tokens = z
            .array(NativeTokenSchema)
            .parse(
              propOr([] as GetNativeTokenResponse[], "native_tokens", res)
            );

          const raw_data = GetBalanceResponseSchema.parse(res);
          const fungibles = raw_data.fungibles.concat(
            native_tokens.map((token) => nativeTokenToFungible(token))
          );

          const data = {
            ...raw_data,
            fungibles: fungibles.filter((f) => {
              const [chain, address] = f.fungible_id.split(".");

              return (
                reports.findIndex(
                  (r) => r.chainId === chain && r.contractAddress === address
                ) === -1
              );
            }),
          };
          return redis
            .setex(cacheKey, CACHE_TTL_SHORT, JSON.stringify(data))
            .then(() => data)
            .catch(() => data);
        });
      });
  }
}
