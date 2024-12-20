import { formatUnits } from "ethers/lib/utils";
import { z } from "zod";
import { SimpleHashChain } from "./sh-chains";

const collectionPriceSchema = z.object({
  marketplace_id: z.string(),
  marketplace_name: z.string(),
  value: z.number(),
  payment_token: z.object({
    payment_token_id: z.string(),
    name: z.string(),
    symbol: z.string(),
    address: z.string().nullable(),
    decimals: z.number(),
  }),
  value_usd_cents: z.number().transform((value) => formatUnits(value, 2)),
});

const CollectionDetailsSchema = z.object({
  collection_id: z.string(),
  name: z.string(),
  description: z.string().nullable().default(""),
  is_nsfw: z.boolean().default(false),

  image_url: z.string().url().nullable(),
  banner_image_url: z.string().url().nullable(),
  external_url: z.string().url().nullable(),

  twitter_username: z.string().nullable(),
  discord_url: z.string().url().nullable(),
  instagram_username: z.string().nullable(),
  medium_username: z.string().nullable(),
  telegram_url: z.string().url().nullable(),

  floor_prices: z.array(collectionPriceSchema),
  top_bids: z.array(collectionPriceSchema),

  chains: z.array(z.nativeEnum(SimpleHashChain)),
});

const CollectionSchema = z.object({
  collection_id: z.string(),
  distinct_nfts_owned: z.number().default(0),
  total_copies_owned: z.number().default(0),
  last_acquired_date: z.string().datetime(),
  nft_ids: z.array(z.string()).default([]),
  collection_details: CollectionDetailsSchema,
});

export const GetCollectionResponseSchema = z.object({
  next_cursor: z.string().nullable(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  collections: z.array(CollectionSchema),
});

export type CollectionPrice = z.infer<typeof collectionPriceSchema>;
export type CollectionDetails = z.infer<typeof CollectionDetailsSchema>;
export type CollectionResponse = z.infer<typeof CollectionSchema>;
export type GetCollectionResponse = z.infer<typeof GetCollectionResponseSchema>;

export const NFTSchema = z.object({
  nft_id: z.string(),
  chain: z.nativeEnum(SimpleHashChain),
  contract_address: z.string(),
  token_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  previews: z.object({
    image_small_url: z.string().url(),
    image_medium_url: z.string().url(),
    image_large_url: z.string().url(),
    image_opengraph_url: z.string().url(),
    blurhash: z.string(),
    predominant_color: z.string(),
  }),
  image_url: z.string().url(),
  image_properties: z.object({
    width: z.number(),
    height: z.number(),
    size: z.number(),
    mime_type: z.string(),
    exif_orientation: z.string().nullable(),
  }),

  video_url: z.string().nullable(),
  video_properties: z.any(),
  audio_url: z.string().nullable(),
  audio_properties: z.any(),
  model_url: z.string().nullable(),
  model_properties: z.any(),
  other_url: z.string().nullable(),
  other_properties: z.any(),
  background_color: z.string().nullable(),
  external_url: z.string().nullable(),

  created_date: z.string(),
  status: z.string(),
  token_count: z.number(),
  owner_count: z.number(),

  owners: z.array(
    z.object({
      owner_address: z.string(),
      quantity: z.number(),
      quantity_string: z.string(),
      first_acquired_date: z.string(),
      last_acquired_date: z.string(),
    })
  ),

  contract: z.object({
    type: z.string(),
    name: z.string().nullable().default(""),
    symbol: z.string().nullable().default(""),
    deployed_by: z.string(),
    deployed_via_contract: z.string().nullable(),
    owned_by: z.string().nullable(),
    has_multiple_collections: z.boolean(),
  }),
  collection: CollectionDetailsSchema,

  // first_created: z.object({
  //   minted_to: z.string(),
  //   quantity: z.number(),
  //   quantity_string: z.string(),
  //   timestamp: z.string(),
  //   block_number: z.number(),
  //   transaction: z.string(),
  //   transaction_initiator: z.string(),
  // }),

  rarity: z.object({
    rank: z.number().nullable().default(0),
    score: z.number().nullable().default(0),
    unique_attributes: z.number().nullable().default(0),
  }),

  royalty: z.array(
    z.object({
      source: z.string(),
      total_creator_fee_basis_points: z.number(),
      recipients: z.array(
        z.object({
          address: z.string(),
          percentage: z.number(),
          basis_points: z.number(),
        })
      ),
    })
  ),

  extra_metadata: z.object({
    attributes: z.array(
      z.object({
        trait_type: z.string(),
        value: z.string(),
        display_type: z.string().nullable(),
      })
    ),
    image_original_url: z.string().url().nullable(),
    animation_original_url: z.string().url().nullable(),
    metadata_original_url: z.string().url().nullable(),
  }),
});

export const GetCollectionNFTsResponseSchema = z.object({
  next_cursor: z.string().nullable(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  nfts: z.array(NFTSchema),
});

export type NFT = z.infer<typeof NFTSchema>;
export type GetCollectionNFTsResponse = z.infer<
  typeof GetCollectionNFTsResponseSchema
>;
