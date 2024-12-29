import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { NFT } from "~/types/simple-hash/nft";

type Props = {
  nft: NFT;
};

export const NftCard = ({ nft }: Props) => {
  console.log(nft);
  return (
    <Link
      to={`/nfts/${nft.collection.collection_id}/${nft.token_id}`}
      prefetch="intent"
    >
      <Card
        className="overflow-hidden bg-cover bg-center min-h-96 aspect-square flex flex-col justify-between"
        style={{ backgroundImage: `url(${nft.previews.image_medium_url})` }}
      >
        <CardHeader className="bg-card/50 backdrop-blur-sm">
          <div className="flex gap-2 justify-between">
            <CardTitle className="z-20 relative">{nft.name}</CardTitle>
            {nft.rarity.rank && <Badge>{nft.rarity.rank}</Badge>}
          </div>
        </CardHeader>
        <MediaFooter nft={nft} />
      </Card>
    </Link>
  );
};

const MediaFooter = ({ nft }: Props) => {
  const media = [nft.audio_url, nft.video_url].filter(Boolean);

  if (media.length === 0) return null;

  return (
    <CardFooter className="bg-card/50 backdrop-blur-sm py-2 justify-end">
      {nft.audio_url && <Button>Play Audio</Button>}
      {nft.video_url && <Button>Play Video</Button>}
    </CardFooter>
  );
};
