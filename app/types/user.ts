import { z } from "zod";
import { TypeId } from "~/lib/type-id/type-id";

export const UserSchema = z.object({
  id: z.string().transform((val) => val as TypeId<"user">),
  address: z.string(),
  ens: z.string().nullish().optional(),
  // avatar: z.string().nullish().optional(),
});

export type User = z.infer<typeof UserSchema>;
