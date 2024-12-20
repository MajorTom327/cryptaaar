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
}
