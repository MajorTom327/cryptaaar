import { pgTable, text, unique } from "drizzle-orm/pg-core";

import { usersTable } from "app/.server/database";
import { Network } from "alchemy-sdk";
import { typeid } from "~/lib/type-id/type-id";

export const contractsTable = pgTable(
  "contracts",
  {
    id: text("id")
      .$defaultFn(() => typeid("contract"))
      .primaryKey()
      .notNull(),
    contractAddress: text("contract_address").notNull(),
    chainId: text("chain_id").notNull().$type<Network>(),
  },
  (t) => ({
    contract_uniq: unique("contract_uniq").on(t.contractAddress, t.chainId),
  }),
);

export const scamReportsTable = pgTable(
  "scam_contracts",
  {
    contractId: text("contract_id")
      .notNull()
      .references(() => contractsTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (t) => ({
    scam_report_uniq: unique("scam_report_uniq").on(t.contractId, t.userId),
  }),
);

export const favoritesTable = pgTable(
  "favorites_contracts",
  {
    contractId: text("contract_id")
      .notNull()
      .references(() => contractsTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (t) => ({
    favorites_uniq: unique("favorites_uniq").on(t.contractId, t.userId),
  }),
);
