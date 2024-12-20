import { formatUnits } from "ethers/lib/utils";
import { z } from "zod";
import { SimpleHashChain } from "./sh-chains";

export const AddressBalanceSchema = z.object({
  address: z.string(),
  quantity: z.number().default(0),
  quantity_string: z.string().nullish().default("0.0"),
  value_usd_cents: z.number().nullish().default(0.0),
  value_usd_string: z.string().nullish().default("0.0"),
  first_transferred_date: z.string().optional(),
  last_transferred_date: z.string().optional(),
  subaccounts: z.array(z.string()).optional().default([]),
});

export const PriceSchema = z.object({
  marketplace_id: z.string(),
  marketplace_name: z.string(),
  value_usd_cents: z.number().nullish().default(0.0),
  value_usd_string: z.string().nullish().default("0.0"),
  value_usd_string_high_precision: z.string().nullish().default("0.0"),
});

export const FungibleSchema = z.object({
  fungible_id: z.string(),
  name: z.string().nullable().default("Unknown"),
  symbol: z.string().nullable().default("Unknown"),
  decimals: z.number(),
  chain: z.nativeEnum(SimpleHashChain),
  prices: z.array(PriceSchema),
  total_quantity: z.number(),
  total_quantity_string: z.string(),
  total_value_usd_cents: z.number().nullish().default(0.0),
  total_value_usd_string: z.string().nullish().default("0.0"),
  queried_wallet_balances: z.array(AddressBalanceSchema),
});

export const NativeTokenSchema = z.object({
  token_id: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  chain: z.nativeEnum(SimpleHashChain),
  total_quantity: z.number(),
  total_quantity_string: z.string(),
  total_value_usd_cents: z.number(),
  queried_wallet_balances: z.array(AddressBalanceSchema),
});

export const GetBalanceResponseSchema = z.object({
  next_cursor: z.string().nullable(),
  fungibles: z.array(FungibleSchema),
  native_tokens: z.array(NativeTokenSchema),
});

export type GetAddressBalanceResponse = z.infer<typeof AddressBalanceSchema>;
export type GetFungibleResponse = z.infer<typeof FungibleSchema>;
export type GetNativeTokenResponse = z.infer<typeof NativeTokenSchema>;
export type GetBalanceResponse = z.infer<typeof GetBalanceResponseSchema>;

export const nativeTokenToFungible = (
  nativeToken: GetNativeTokenResponse
): GetFungibleResponse => {
  return {
    fungible_id: nativeToken.token_id,
    name: nativeToken.name,
    symbol: nativeToken.symbol,
    decimals: nativeToken.decimals,
    chain: nativeToken.chain,
    prices: [
      {
        marketplace_id: "simplehash",
        marketplace_name: "SimpleHash",
        value_usd_cents: nativeToken.total_value_usd_cents,
        value_usd_string: nativeToken.total_value_usd_cents.toString(),
        value_usd_string_high_precision:
          nativeToken.total_value_usd_cents.toString(),
      },
    ],
    total_quantity: nativeToken.total_quantity,
    total_quantity_string: nativeToken.total_quantity_string,
    total_value_usd_cents: nativeToken.total_value_usd_cents,
    total_value_usd_string: formatUnits(nativeToken.total_value_usd_cents, 2),
    queried_wallet_balances: nativeToken.queried_wallet_balances.map((bal) => ({
      ...bal,
      value_usd_string: formatUnits(bal.value_usd_cents ?? 0, 2),
    })),
  };
};
