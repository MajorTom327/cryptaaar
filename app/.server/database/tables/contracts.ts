import { pgTable, text, unique } from "drizzle-orm/pg-core";

import { users } from "app/.server/database";
import { typeid } from "~/lib/type-id/type-id";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";

export const contracts = pgTable(
  "contracts",
  {
    id: text("id")
      .$defaultFn(() => typeid("contract"))
      .primaryKey()
      .notNull(),
    contractAddress: text("contract_address").notNull(),
    chainId: text("chain_id").notNull().$type<SimpleHashChain>(),
  },
  (t) => ({
    contract_uniq: unique("contract_uniq").on(t.contractAddress, t.chainId),
  })
);

export const scamReports = pgTable(
  "scam_contracts",
  {
    contractId: text("contract_id")
      .notNull()
      .references(() => contracts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    scam_report_uniq: unique("scam_report_uniq").on(t.contractId, t.userId),
  })
);

export const favoritesContracts = pgTable(
  "favorites_contracts",
  {
    contractId: text("contract_id")
      .notNull()
      .references(() => contracts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => ({
    favorites_uniq: unique("favorites_uniq").on(t.contractId, t.userId),
  })
);
