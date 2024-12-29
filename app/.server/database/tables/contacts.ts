import { pgTable, text } from "drizzle-orm/pg-core";
import { typeid } from "~/lib/type-id/type-id";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";
import { users } from ".";

export const contacts = pgTable("contacts", {
  id: text("id")
    .$defaultFn(() => typeid("contact"))
    .primaryKey()
    .notNull(),

  label: text("label").notNull(),
  description: text("description"),

  network: text("network").notNull().$type<SimpleHashChain>(),
  address: text("address").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
