import { Badge } from "~/components/ui/badge";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { CollectionResponse } from "~/types/simple-hash/nft";

type Props = {
  collection: CollectionResponse;
  onClick: () => void;
};

export const CollectionItem: React.FC<Props> = ({ collection, onClick }) => {
  return (
    <button onClick={onClick} className="cursor-pointer snap-start group">
      <Card
        className="w-96 h-48 bg-cover bg-no-repeat bg-center flex flex-col justify-end relative"
        style={{
          backgroundImage: `url(${collection.collection_details.image_url})`,
        }}
      >
        <Badge className="absolute top-2 right-2" variant="secondary">
          {collection.distinct_nfts_owned}
        </Badge>
        <CardHeader className="bg-card/50 group-hover:bg-card/80 transition-all duration-300 flex flex-col items-center justify-center gap-2">
          <CardTitle className="truncate">
            {collection.collection_details.name}
          </CardTitle>
        </CardHeader>
      </Card>
    </button>
  );
};
