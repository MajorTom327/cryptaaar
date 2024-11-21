import { v7 } from "uuid";
import { Session, SessionData } from "@remix-run/node";
import { ethers } from "ethers";

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
}
