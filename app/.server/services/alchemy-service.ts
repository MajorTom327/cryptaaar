import { Alchemy, AlchemySettings, Network } from "alchemy-sdk";
import { envService } from "./env-service";

export class AlchemyService {
  private static instances = new Map<Network, Alchemy>();

  private constructor() {}

  public static getClient(network: Network = Network.ETH_MAINNET): Alchemy {
    if (!AlchemyService.instances.has(network)) {
      AlchemyService.instances.set(network, this.createClient(network));
    }
    const instance = AlchemyService.instances.get(network);

    if (!instance) {
      throw new Error("Cannot create an instance of Alchemy");
    }
    return instance;
  }

  public static all(): Alchemy[] {
    return this.getNetworks().map((network) => this.getClient(network));
  }

  public static getNetworks() {
    return [
      Network.ETH_MAINNET,
      Network.OPT_MAINNET,
      Network.MATIC_MAINNET,
      Network.BASE_MAINNET,
      Network.BNB_MAINNET,
      Network.OPBNB_MAINNET,
    ];
  }

  private static createClient(network: Network = Network.ETH_MAINNET) {
    const settings = this.getSettings(network);
    return new Alchemy(settings);
  }

  private static getSettings(
    network: Network = Network.ETH_MAINNET,
  ): AlchemySettings {
    return {
      apiKey: envService.env.ALCHEMY_API_KEY,
      network,
    };
  }
}
