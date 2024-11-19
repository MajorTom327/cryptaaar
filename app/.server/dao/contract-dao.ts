import { User } from "~/types";
import { contractsTable, favoritesTable } from "~/.server/database";
import { db } from "~/.server/db";
import { and, eq } from "drizzle-orm";
import { Network } from "alchemy-sdk";
import { isNil } from "rambda";

export class ContractDao {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  async getFavorites() {
    return db
      .select({
        contractAddress: contractsTable.contractAddress,
        chainId: contractsTable.chainId,
      })
      .from(favoritesTable)
      .leftJoin(
        contractsTable,
        eq(contractsTable.id, favoritesTable.contractId),
      )
      .where(eq(favoritesTable.userId, this.user.id));
  }

  async getOrCreateContract(address: string, chainId: Network) {
    return db.transaction(async (tx) => {
      const [getContract] = await tx
        .select()
        .from(contractsTable)
        .where(
          and(
            eq(contractsTable.contractAddress, address),
            eq(contractsTable.chainId, chainId),
          ),
        )
        .limit(1);

      if (!isNil(getContract)) {
        return getContract;
      }

      const [contract] = await tx
        .insert(contractsTable)
        .values({
          chainId: chainId,
          contractAddress: address,
        })
        .onConflictDoNothing()
        .returning();
      return contract;
    });
  }

  async toggleFavorite(address: string, chainId: Network) {
    return db.transaction(async (tx) => {
      const contract = await this.getOrCreateContract(address, chainId);

      console.log("CONTRACT", contract);
      if (isNil(contract)) throw new Error("Contract not found");

      const [favorite] = await tx
        .select()
        .from(favoritesTable)
        .where(
          and(
            eq(favoritesTable.contractId, contract.id),
            eq(favoritesTable.userId, this.user.id),
          ),
        )
        .limit(1);

      console.log("FAVORITE", {
        request: tx
          .select()
          .from(favoritesTable)
          .where(
            and(
              eq(favoritesTable.contractId, contract.id),
              eq(favoritesTable.userId, this.user.id),
            ),
          )
          .limit(1)
          .toSQL(),
        favorite,
        contractId: contract.id,
        userId: this.user.id,
      });

      if (isNil(favorite)) {
        console.log("Setting as favorite");
        const [favorite] = await tx
          .insert(favoritesTable)
          .values({
            contractId: contract.id,
            userId: this.user.id,
          })
          .returning();
        return favorite;
      } else {
        console.log("Removing as favorite");
        await tx
          .delete(favoritesTable)
          .where(
            and(
              eq(favoritesTable.contractId, contract.id),
              eq(favoritesTable.userId, this.user.id),
            ),
          );
      }
    });
  }
}
