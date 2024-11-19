import { Network } from "alchemy-sdk";
import { match } from "ts-pattern"; // Network.ETH_MAINNET,

export const NetworkFormat: React.FC<{ network: Network }> = ({ network }) => {
  return match(network)
    .with(Network.ETH_MAINNET, () => "Ethereum")
    .with(Network.OPT_MAINNET, () => "Optimism")
    .with(Network.MATIC_MAINNET, () => "Polygon")
    .with(Network.BASE_MAINNET, () => "Base")
    .with(Network.BNB_MAINNET, () => "BNB")
    .with(Network.OPBNB_MAINNET, () => "Optimism BNB")
    .otherwise((network) => `Unknown network: ${network}`);
};
