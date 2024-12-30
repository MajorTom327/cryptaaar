import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";

export const addContactSchema = z
  .object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).default(""),

    ens: z.string().max(500).default(""),
    address: z.string().max(500).default(""),
    network: z.nativeEnum(SimpleHashChain).default(SimpleHashChain.ethereum),
  })
  .refine((data) => {
    return (
      data.ens.length > 0 ||
      data.address.length > 0 || {
        message: "Either ENS or Address must be provided",
      }
    );
  });

export type AddContactFormData = z.infer<typeof addContactSchema>;
export const resolverAddContact = zodResolver(addContactSchema);
