import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const addContactSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(""),

  address: z.string().max(500).default(""),
});

export type AddContactFormData = z.infer<typeof addContactSchema>;
export const resolverAddContact = zodResolver(addContactSchema);
