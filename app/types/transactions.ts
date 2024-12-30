import { BigNumber } from "ethers";
import { DateTime } from "luxon";
import { z } from "zod";
import { SimpleHashChain } from "./simple-hash/sh-chains";

export const TransactionSchema = z.object({
  blockNum: z.string().transform((val) => BigNumber.from(val)),
  uniqueId: z.string(),
  hash: z.string(),
  from: z.string(),
  value: z.number().nullable(),
  //   erc721TokenId:
  //   erc1155Metadata:
  //   tokenId:
  asset: z.string().nullable(),
  category: z.string(),
  rawContract: z
    .object({
      value: z.string().nullable(),
      address: z.string().nullable(),
      decimal: z.string().nullable(),
    })
    .partial(),
  metadata: z.object({
    blockTimestamp: z.string().refine((val) => DateTime.fromISO(val).isValid, {
      message: "Not a valide datetime",
    }),
  }),
  chain: z.nativeEnum(SimpleHashChain),
});

export type Transaction = z.infer<typeof TransactionSchema>;
