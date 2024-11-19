import { pgTable, text } from "drizzle-orm/pg-core";
import { typeid } from "~/lib/type-id/type-id";

export type UserId = string;

export const usersTable = pgTable("users", {
  id: text("id")
    .$defaultFn(() => typeid("user"))
    .primaryKey()
    .notNull(),

  mainAddress: text("main_address").notNull(),
});

export const addressesTable = pgTable("user_addresses", {
  user: text("id")
    .$defaultFn(() => typeid("user"))
    .notNull()
    .references(() => usersTable.id),
  address: text("address").notNull().unique(),
});
