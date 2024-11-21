import { db } from "~/.server/db";
import { addressesTable, users } from "~/.server/database";
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
      .insert(users)
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

    const rows = await db
      .select()
      .from(users)
      .leftJoin(addressesTable, eq(addressesTable.user, users.id))
      .where(
        and(eq(users.email, hashedEmail), eq(users.password, hashedPassword)),
      );

    if (rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    return {
      id: rows[0].users.id,
      email: rows[0].users.email,
      addresses: rows.map((row) => row.user_addresses?.address).filter(Boolean),
    };
  }

  async register(email: string, password: string) {
    const hashedEmail = this.transformUserEmail(email);
    const hashedPassword = this.transformUserPassword(password);

    const user = await db
      .insert(users)
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

  async addAddress(user: { id: string }, address: string) {
    return db
      .insert(addressesTable)
      .values({
        user: user.id,
        address,
      })
      .returning();
  }
}
