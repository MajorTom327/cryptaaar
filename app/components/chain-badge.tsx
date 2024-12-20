import { SimpleHashChain } from "~/types/simple-hash/sh-chains";
import { ChainFormat } from "./formatters/chain-format";
import { Badge } from "./ui/badge";

type Props = {
  chain: SimpleHashChain;
};

export const ChainBadge: React.FC<Props> = ({ chain }) => {
  return (
    <Badge variant="secondary">
      <ChainFormat chain={chain} />
    </Badge>
  );
};
