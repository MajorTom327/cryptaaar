import {
  GetCollectionNFTsResponse,
  GetCollectionNFTsResponseSchema,
  GetCollectionResponse,
  GetCollectionResponseSchema,
} from "~/types/simple-hash/nft";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";
import { CACHE_TTL_SHORT, redis } from "../redis-service";
import { SimpleHashService } from "./simple-hash";

export class NftService extends SimpleHashService {
  async getCollections() {
    const walletAddresses = this.getAddresses();

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
          order_by: "total_copies_owned__desc",
        },
      }).then((res) => {
        return redis
          .setex(cacheKey, CACHE_TTL_SHORT, JSON.stringify(res))
          .then(() => res)
          .catch(() => res);
      });
    });
  }

  async getCollectionNFTs(collectionId: string, address?: string | string[]) {
    const addresses = this.getAddresses(address);
    const cacheKey = `${collectionId}:nfts:${addresses.join(",")}`;

    return redis.get(cacheKey).then((nfts) => {
      if (nfts) {
        return GetCollectionNFTsResponseSchema.parse(JSON.parse(nfts));
      }

      return this.get<GetCollectionNFTsResponse>({
        path: "/api/v0/nfts/owners_v2",
        query: {
          chains: Object.values(SimpleHashChain).join(","),
          wallet_addresses: addresses.join(","),
          collection_ids: collectionId,
          order_by: "transfer_time__desc",
          limit: 20,
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
