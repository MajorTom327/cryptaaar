import { Link } from "@remix-run/react";
import { ChainBadge } from "~/components/chain-badge";
import { Badge } from "~/components/ui/badge";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { CollectionResponse } from "~/types/simple-hash/nft";

type Props = {
  collection: CollectionResponse;
};

export const CollectionItem: React.FC<Props> = ({ collection }) => {
  return (
    <Link
      to={`/nfts/${collection.collection_id}`}
      prefetch="intent"
      className="cursor-pointer snap-start group"
    >
      <Card
        className="w-96 h-48 bg-cover bg-no-repeat bg-center flex flex-col justify-end relative"
        style={{
          backgroundImage: `url(${collection.collection_details.image_url})`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between">
          <div className="flex gap-2">
            {collection.collection_details.chains.map((chain) => (
              <ChainBadge key={chain} chain={chain} />
            ))}
          </div>
          <Badge variant="secondary">{collection.distinct_nfts_owned}</Badge>
        </div>
        <CardHeader className="bg-card/50 group-hover:bg-card/80 transition-all duration-300 flex flex-col items-center justify-center gap-2">
          <CardTitle className="truncate">
            {collection.collection_details.name}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
};
