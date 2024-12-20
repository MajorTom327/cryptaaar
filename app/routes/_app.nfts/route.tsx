import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { authenticator } from "~/.server/services/authenticator";
import { NftService } from "~/.server/services/simple-hash/nft-service";
import { Separator } from "~/components/ui/separator";
import { CollectionItem } from "./components/collection-item";
import { CollectionSelector } from "./components/collection-selector";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const nftService = new NftService(user);

  return {
    collections: await nftService.getCollections(),
  };
}

export const NftsIndexRoute = () => {
  const { collections } = useLoaderData<typeof loader>();

  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );

  const currentCollection = collections.collections.find(
    (col) => col.collection_id === selectedCollection
  );

  console.log(collections);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-8 ">
        <div className="col-span-1 flex flex-col justify-center">
          {currentCollection && (
            <CollectionItem collection={currentCollection} onClick={() => {}} />
          )}
        </div>

        <div className="col-span-3">
          <CollectionSelector
            collections={collections.collections}
            onSelect={setSelectedCollection}
          />
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default NftsIndexRoute;
