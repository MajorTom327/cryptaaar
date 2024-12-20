import {
  GetCollectionResponse,
  GetCollectionResponseSchema,
} from "~/types/simple-hash/nft";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";
import { CACHE_TTL_SHORT, redis } from "../redis-service";
import { SimpleHashService } from "./simple-hash";

export class NftService extends SimpleHashService {
  async getCollections() {
    const walletAddresses = this.user.addresses
      .filter((a) => a !== undefined)
      .sort((a, b) => a.localeCompare(b));

    const cacheKey = `${walletAddresses.join(",")}:collections`;

    return redis.get(cacheKey).then((collections) => {
      if (collections) {
        return GetCollectionResponseSchema.parse(JSON.parse(collections));
      }

      return this.get<GetCollectionResponse>({
        path: "/api/v0/nfts/collections_by_wallets_v2",
        query: {
          chains: Object.values(SimpleHashChain).join(","),
          wallet_addresses: walletAddresses.join(","),
          spam_score__lte: 75,
        },
      }).then((res) => {
        return redis
          .setex(cacheKey, CACHE_TTL_SHORT, JSON.stringify(res))
          .then(() => res)
          .catch(() => res);
      });
    });
  }
}
