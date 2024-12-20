import { match } from "ts-pattern";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";

export const chainNameFormatter = (chain: SimpleHashChain) => {
  return match(chain)
    .with(SimpleHashChain.ethereum, () => "Ethereum")
    .with(SimpleHashChain.polygon, () => "Polygon")
    .with(SimpleHashChain.base, () => "Base")
    .with(SimpleHashChain.avalanche, () => "Avalanche")
    .with(SimpleHashChain.bsc, () => "BSC")
    .with(SimpleHashChain.solana, () => "Solana")
    .with(SimpleHashChain.optimism, () => "Optimism")
    .with(SimpleHashChain.opbnb, () => "OPBNB")
    .exhaustive();
};

export const ChainFormat: React.FC<{ chain: SimpleHashChain }> = ({
  chain,
}) => {
  return <>{chainNameFormatter(chain)}</>;
};
