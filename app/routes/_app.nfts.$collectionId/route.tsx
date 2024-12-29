import { Suspense, useState } from "react";
import { Await, Outlet, redirect, useLoaderData } from "react-router";
import { z } from "zod";
import { NftService } from "~/.server/services/simple-hash/nft-service";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/route";
import { NftCard } from "./components/nft-card";
export { ErrorBoundary } from "~/components/error-boundary";

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const user = await preventNotConnected(request);

  const parsedParams = z.object({ collectionId: z.string() }).safeParse(params);

  if (!parsedParams.success) {
    return redirect("/nfts");
  }

  const { collectionId } = parsedParams.data;

  const nftService = new NftService(user);
  console.log(context);

  return {
    nfts: nftService.getCollectionNFTs(collectionId),
  };
}

export const NftsCollectionRoute = () => {
  const { nfts } = useLoaderData<typeof loader>();
  const [search, setSearch] = useState("");
  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-row gap-4 flex-wrap justify-evenly">
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={nfts}>
              {({ nfts }) => {
                return nfts
                  .filter((el) =>
                    el.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((nft) => <NftCard key={nft.token_id} nft={nft} />);
              }}
            </Await>
          </Suspense>
        </div>
        <div className="col-span-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default NftsCollectionRoute;
