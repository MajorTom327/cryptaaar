import { match } from "ts-pattern";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";

export const NetworkFormat: React.FC<{ network: SimpleHashChain }> = ({
  network,
}) => {
  return match(network)
    .with(SimpleHashChain.ethereum, () => "Ethereum")
    .with(SimpleHashChain.optimism, () => "Optimism")
    .with(SimpleHashChain.polygon, () => "Polygon")
    .with(SimpleHashChain.base, () => "Base")
    .with(SimpleHashChain.opbnb, () => "Optimism BNB")
    .otherwise((network) => `Unknown network: ${network}`);
};
