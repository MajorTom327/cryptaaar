import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { GetCollectionResponse } from "~/types/simple-hash/nft";
import { CollectionItem } from "./collection-item";

type Props = {
  collections: GetCollectionResponse["collections"];
  onSelect: (collectionId: string) => void;
};

export const CollectionSelector: React.FC<Props> = ({
  collections,
  onSelect,
}) => {
  return (
    <>
      <ScrollArea className="w-full rounded snap-x">
        <div className="flex w-max p-8 gap-4">
          {collections.map((collection) => (
            <CollectionItem
              key={collection.collection_id}
              collection={collection}
              onClick={() => onSelect(collection.collection_id)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};
