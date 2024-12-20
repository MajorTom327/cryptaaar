import { match } from "ts-pattern";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";
import { Badge } from "./ui/badge";

type Props = {
  chain: SimpleHashChain;
};

const chainToName = (chain: SimpleHashChain) => {
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

export const ChainBadge: React.FC<Props> = ({ chain }) => {
  return <Badge variant="secondary">{chainToName(chain)}</Badge>;
};
