import { v7 } from "uuid";
import { Session, SessionData } from "@remix-run/node";
import { ethers } from "ethers";
import { addressesTable } from "~/.server/database";
import { db } from "~/.server/db";
import { and, eq } from "drizzle-orm";

type VerifyTokenData = {
  token: string;
  address: string;
  message: {
    data: string;
    signature: string;
  };
};

export class AddressesDao {
  generateToken() {
    return v7();
  }

  verifyToken(
    data: VerifyTokenData,
    session: Session<SessionData, SessionData>,
  ) {
    const { token, message, address } = data;

    if (!session.has("token")) {
      return false;
    }

    if (session.get("token") !== token) {
      return false;
    }

    const signerAddr = ethers.utils.verifyMessage(
      message.data,
      message.signature,
    );

    if (signerAddr !== address) {
      return false;
    }

    const signedPayload = JSON.parse(message.data.split("\n")[1]);

    if (signedPayload.address !== address) {
      return false;
    }

    return true;
  }

  async getAddresses(user: { id: string }) {
    return db
      .select()
      .from(addressesTable)
      .where(eq(addressesTable.user, user.id));
  }

  async getMainAddress(user: { id: string }) {
    return db
      .select()
      .from(addressesTable)
      .where(
        and(eq(addressesTable.user, user.id), eq(addressesTable.isMain, true)),
      )
      .limit(1)
      .then((addresses) =>
        addresses.length > 0 ? addresses[0].address : null,
      );
  }
}
