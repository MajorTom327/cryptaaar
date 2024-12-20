import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/.server/services/authenticator";
import { NftService } from "~/.server/services/blockchain/nft-service";

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

  console.log(collections);

  return <div>NftsIndexRoute</div>;
};

export default NftsIndexRoute;
