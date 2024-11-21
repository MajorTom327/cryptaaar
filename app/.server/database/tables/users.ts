import { pgTable, text } from "drizzle-orm/pg-core";
import { typeid } from "~/lib/type-id/type-id";

export type UserId = string;

export const users = pgTable("users", {
  id: text("id")
    .$defaultFn(() => typeid("user"))
    .primaryKey()
    .notNull(),

  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const addressesTable = pgTable("user_addresses", {
  user: text("id")
    .notNull()
    .references(() => users.id),
  address: text("address").notNull().unique(),
});
