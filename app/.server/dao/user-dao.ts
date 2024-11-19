import { db } from "~/.server/db";
import { usersTable } from "~/.server/database";
import { eq } from "drizzle-orm";

export class UserDao {
  private address: string | undefined;

  constructor(address?: string) {
    this.address = address;
  }

  async getOrCreate(address: string) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.mainAddress, address))
      .limit(1);

    if (user.length > 0) {
      return user[0];
    }

    return db
      .insert(usersTable)
      .values({
        mainAddress: address,
      })
      .returning()
      .then((el) => {
        if (el.length === 0) throw new Error("User not found");
        return el[0];
      });
  }
}
