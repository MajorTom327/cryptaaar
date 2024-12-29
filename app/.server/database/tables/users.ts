import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { typeid } from "~/lib/type-id/type-id";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";

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
  network: text("network")
    .notNull()
    .$type<SimpleHashChain>()
    .$defaultFn(() => SimpleHashChain.ethereum),
  isMain: boolean("is_main").notNull().default(false),
  isHardware: boolean("is_hardware").notNull().default(false),
  label: text("label"),
});

export type UserAddress = typeof addressesTable.$inferSelect;
export type NewUserAddress = typeof addressesTable.$inferInsert;
