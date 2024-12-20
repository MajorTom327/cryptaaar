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
