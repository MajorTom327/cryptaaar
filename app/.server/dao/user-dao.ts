import { db } from "~/.server/db";
import { addressesTable, usersTable } from "~/.server/database";
import { and, eq } from "drizzle-orm";
import crypto from "node:crypto";

export class UserDao {
  private address: string | undefined;

  constructor(address?: string) {
    this.address = address;
  }

  transformUserEmail(email: string) {
    return crypto.createHash("sha256").update(email).digest("hex");
  }

  transformUserPassword(password: string) {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  async createUser(email: string, password: string) {
    const hashedEmail = this.transformUserEmail(email);
    const hashedPassword = this.transformUserPassword(password);

    const user = await db
      .insert(usersTable)
      .values({
        email: hashedEmail,
        password: hashedPassword,
      })
      .returning();

    return user[0];
  }

  async login(email: string, password: string) {
    const hashedEmail = this.transformUserEmail(email);
    const hashedPassword = this.transformUserPassword(password);

    const user = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        address: addressesTable.address,
      })
      .from(usersTable)
      .leftJoin(addressesTable, eq(addressesTable.user, usersTable.id))
      .where(
        and(
          eq(usersTable.email, hashedEmail),
          eq(usersTable.password, hashedPassword),
        ),
      )
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    return user[0];
  }

  async register(email: string, password: string) {
    const hashedEmail = this.transformUserEmail(email);
    const hashedPassword = this.transformUserPassword(password);

    const user = await db
      .insert(usersTable)
      .values({
        email: hashedEmail,
        password: hashedPassword,
      })
      .returning();

    return user[0];
  }

  async getAddresses(userId: string) {
    return db
      .select({ address: addressesTable.address })
      .from(addressesTable)
      .where(eq(addressesTable.user, userId))
      .then((addresses) => addresses.map((address) => address.address));
  }
}
