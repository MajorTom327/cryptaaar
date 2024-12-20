import { z } from "zod";

export const EnsLookupItemResponseSchema = z.object({
  address: z.string(),
  ens: z.string().nullable(),
});

export const EnsLookupResponseSchema = z.array(EnsLookupItemResponseSchema);

export type EnsLookupResponse = z.infer<typeof EnsLookupResponseSchema>;
