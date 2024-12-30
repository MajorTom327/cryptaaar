import { match, P } from "ts-pattern";
import { User } from "~/types";
import { BaseService } from "../base-service";
import { envService } from "../env-service";

export class SimpleHashService extends BaseService {
  protected user: User;

  constructor(user: User) {
    super({
      baseApiUrl: "https://api.simplehash.com",
      accessToken: envService.env.SIMPLE_HASH_API_KEY,
    });
    this.user = user;
  }

  protected getAddresses(address?: string | string[]) {
    const addresses = match(address)
      .with(P.array(), (addresses) => addresses)
      .with(P.string, (address) => [address])
      .otherwise(() => this.user.addresses);

    return addresses
      .filter((a) => a !== undefined)
      .sort((a, b) => a.localeCompare(b));
  }
}
