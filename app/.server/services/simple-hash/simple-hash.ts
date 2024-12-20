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
}
