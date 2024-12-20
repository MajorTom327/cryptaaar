import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useParams } from "@remix-run/react";
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
