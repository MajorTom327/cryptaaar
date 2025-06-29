import { Outlet, useLoaderData, useParams } from "react-router";
import { NftService } from "~/.server/services/data/nft-service";
import { preventNoWallet } from "~/.server/utils/prevent/prevent-no-wallet";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { Separator } from "~/components/ui/separator";
import type { Route } from "./+types/route";
import { CollectionItem } from "./components/collection-item";
import { CollectionSelector } from "./components/collection-selector";
export { ErrorBoundary } from "~/components/error-boundary";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await preventNotConnected(request);

  await preventNoWallet(user);
  const nftService = new NftService(user!);

  return {
    collections: await nftService.getCollections(),
  };
}

export const NftsIndexRoute = () => {
  const { collections } = useLoaderData<typeof loader>();

  const params = useParams();
  const selectedCollection = params.collectionId;

  const currentCollection = collections.collections.find(
    (col) => col.collection_id === selectedCollection
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-8 ">
        <div className="col-span-1 flex flex-col justify-center">
          {currentCollection && (
            <CollectionItem collection={currentCollection} />
          )}
        </div>

        <div className="col-span-3">
          <CollectionSelector collections={collections.collections} />
        </div>
      </div>
      <Separator />

      <Outlet />
    </div>
  );
};

export default NftsIndexRoute;
