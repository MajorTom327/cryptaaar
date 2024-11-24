import { User } from "~/types";
import { contracts, favoritesContracts, scamReports } from "~/.server/database";
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
        contractAddress: contracts.contractAddress,
        chainId: contracts.chainId,
      })
      .from(favoritesContracts)
      .leftJoin(contracts, eq(contracts.id, favoritesContracts.contractId))
      .where(eq(favoritesContracts.userId, this.user.id));
  }

  async getOrCreateContract(address: string, chainId: Network) {
    return db.transaction(async (tx) => {
      const [getContract] = await tx
        .select()
        .from(contracts)
        .where(
          and(
            eq(contracts.contractAddress, address),
            eq(contracts.chainId, chainId),
          ),
        )
        .limit(1);

      if (!isNil(getContract)) {
        return getContract;
      }

      const [contract] = await tx
        .insert(contracts)
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

      if (isNil(contract)) throw new Error("Contract not found");

      const [favorite] = await tx
        .select()
        .from(favoritesContracts)
        .where(
          and(
            eq(favoritesContracts.contractId, contract.id),
            eq(favoritesContracts.userId, this.user.id),
          ),
        )
        .limit(1);

      if (isNil(favorite)) {
        console.log("Setting as favorite");
        const [favorite] = await tx
          .insert(favoritesContracts)
          .values({
            contractId: contract.id,
            userId: this.user.id,
          })
          .returning();
        return favorite;
      } else {
        console.log("Removing as favorite");
        await tx
          .delete(favoritesContracts)
          .where(
            and(
              eq(favoritesContracts.contractId, contract.id),
              eq(favoritesContracts.userId, this.user.id),
            ),
          );
      }
    });
  }

  async reportAsScam(address: string, chainId: Network) {
    const contract = await this.getOrCreateContract(address, chainId);
    if (isNil(contract)) throw new Error("Contract not found");

    return db.insert(scamReports).values({
      contractId: contract.id,
      userId: this.user.id,
    });
  }

  async getScamReports() {
    return db
      .select()
      .from(scamReports)
      .rightJoin(contracts, eq(scamReports.contractId, contracts.id))
      .where(eq(scamReports.userId, this.user.id))
      .then((reports) => {
        return reports.map(({ contracts }) => contracts);
      });
  }
}
