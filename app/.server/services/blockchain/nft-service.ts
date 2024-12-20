import { BaseNftCollection, Network, OwnedNft } from "alchemy-sdk";
import { isNil } from "rambda";
import { User } from "~/types";
import { AlchemyService } from "../alchemy-service";
import { CACHE_TTL_LONG, redis } from "../redis-service";
export class NftService {
  user: User;

  constructor(user: User) {
    this.user = user;
  }

  getNftsForAddress(
    address: string,
    network: Network = Network.ETH_MAINNET
  ): Promise<OwnedNft[]> {
    const client = AlchemyService.getClient(network);

    const cacheKey = `${network}:${address}:nfts`;

    return redis.get(cacheKey).then((nfts) => {
      if (nfts) {
        return JSON.parse(nfts) as OwnedNft[];
      }

      return client.nft
        .getNftsForOwner(address)
        .then((result) => result.ownedNfts)
        .then((ownedNfts) => {
          return redis
            .setex(cacheKey, CACHE_TTL_LONG, JSON.stringify(ownedNfts))
            .then(() => ownedNfts)
            .catch(() => ownedNfts);
        });
    });
  }

  getNfts(network: Network = Network.ETH_MAINNET): Promise<OwnedNft[]> {
    const nfts = Promise.all(
      this.user.addresses
        .filter((address) => address !== undefined)
        .map((address) => this.getNftsForAddress(address, network))
    ).then((results) => {
      console.log("NFTS", JSON.stringify(results.flat()));
      return results.flat();
    });

    return nfts;
  }

  getCollectionsForAddress(
    address: string,
    network: Network = Network.ETH_MAINNET
  ): Promise<BaseNftCollection[]> {
    return this.getNftsForAddress(address, network).then((nfts) => {
      return [
        ...new Set(
          nfts
            .map((nft) => nft.collection)
            .filter((collection) => !isNil(collection))
        ),
      ];
    });
  }

  // TODO: Use the endpoint provided by alchemy to get collections
  // https://docs.alchemy.com/reference/getcollectionsforowner-v3
  getCollections(
    network: Network = Network.ETH_MAINNET
  ): Promise<BaseNftCollection[]> {
    return Promise.all(
      this.user.addresses
        .filter((address) => address !== undefined)
        .map((address) => this.getCollectionsForAddress(address, network))
    ).then((results) => {
      return [
        ...new Set(
          results.flat().map((collection) => JSON.stringify(collection))
        ),
      ].map((collection) => JSON.parse(collection));
    });
  }
}
