import { User, UserSchema } from "~/types";
import { getSession } from "~/.server/services/session-service";
import { redirect, Session } from "@remix-run/node";
import { ethers } from "ethers";
import { typeid } from "typeid-js";
import { AlchemyService } from "~/.server/services/alchemy-service";
import { Alchemy } from "alchemy-sdk";
import { UserDao } from "~/.server/dao/user-dao";

type AuthConfig = Partial<{
  failureRedirect: string;
  successRedirect: string;
}>;

type ValidateTokenData = {
  message: {
    data: string;
    signature: string;
  };
  address: string;
  token: string;
};

export class Authenticator {
  private web3Provider: Alchemy;

  constructor() {
    this.web3Provider = AlchemyService.getClient();
  }

  async isAuthenticated(
    request: Request,
    options: AuthConfig = {},
  ): Promise<User | null> {
    const req = request.clone();
    const session = await getSession(req.headers.get("Cookie"));

    if (!session.has("user")) {
      return this.onFailureRedirect(options);
    }

    const parsedUser = UserSchema.safeParse(session.get("user"));

    if (!parsedUser.success) {
      return this.onFailureRedirect(options);
    }

    if (options.successRedirect) {
      throw redirect(options.successRedirect);
    }
    return parsedUser.data;
  }

  async generateToken(session: Session) {
    session.set("token", typeid("auth").toString());

    return session;
  }

  async validateToken(
    request: Request,
    { message, token, address }: ValidateTokenData,
  ) {
    const req = request.clone();
    const session = await getSession(req.headers.get("Cookie"));

    if (!session.has("token")) {
      return this.onFailureRedirect();
    }

    if (session.get("token") !== token) {
      return this.onFailureRedirect();
    }

    const signerAddr = await ethers.utils.verifyMessage(
      message.data,
      message.signature,
    );

    if (signerAddr !== address) {
      return this.onFailureRedirect();
    }

    const signedPayload = JSON.parse(message.data.split("\n")[1]);

    if (signedPayload.address !== address) {
      return this.onFailureRedirect();
    }

    return this.getUser(address);
  }

  protected async onFailureRedirect(config: AuthConfig = {}) {
    if (config.failureRedirect) {
      throw redirect(config.failureRedirect);
    }
    return null;
  }

  protected async getUser(address: string): Promise<User> {
    const userDao = new UserDao();

    return UserSchema.parse({
      id: await userDao.getOrCreate(address).then((el) => el.id),
      address: address,
      ens: await this.web3Provider.core.lookupAddress(address),
    });
  }
}

export const authenticator = new Authenticator();
