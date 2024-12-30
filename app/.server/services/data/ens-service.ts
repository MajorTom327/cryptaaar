import {
  EnsLookupResponse,
  EnsLookupResponseSchema,
} from "~/types/simple-hash/ens";
import { CACHE_TTL_LONG, redis } from "../redis-service";
import { SimpleHashService } from "./simple-hash";

export class EnsService extends SimpleHashService {
  async getEnsForAddress(address?: string | string[]) {
    const walletAddresses = this.getAddresses(address);
    const cacheKey = `${walletAddresses.join(",")}:ens`;

    return redis.get(cacheKey).then((ens) => {
      if (ens) {
        return EnsLookupResponseSchema.parse(JSON.parse(ens));
      }

      return this.get<EnsLookupResponse>({
        path: "/api/v0/ens/reverse_lookup",
        query: {
          wallet_addresses: walletAddresses.join(","),
        },
      }).then((res) => {
        return redis
          .setex(cacheKey, CACHE_TTL_LONG, JSON.stringify(res))
          .then(() => res)
          .catch(() => res);
      });
    });
  }

  async getAddressForEns(ens?: string | string[]) {
    const ensNames = this.getAddresses(ens);
    const cacheKey = `${ensNames.join(",")}:address`;

    return redis.get(cacheKey).then((result) => {
      if (result) {
        return EnsLookupResponseSchema.parse(JSON.parse(result));
      }

      return this.get<EnsLookupResponse>({
        path: "/api/v0/ens/lookup",
        query: {
          ens_names: ensNames.join(","),
        },
      }).then((res) => {
        return redis
          .setex(cacheKey, CACHE_TTL_LONG, JSON.stringify(res))
          .then(() => res)
          .catch(() => res);
      });
    });
  }
}
