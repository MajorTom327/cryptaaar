import { LoaderFunctionArgs, redirect } from "react-router";
import { Await, Outlet, useLoaderData } from "react-router";
import { Suspense, useState } from "react";
import { z } from "zod";
import { authenticator } from "~/.server/services/authenticator";
import { NftService } from "~/.server/services/simple-hash/nft-service";
import { Input } from "~/components/ui/input";
import { NftCard } from "./components/nft-card";

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

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
