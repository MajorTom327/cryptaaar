import { eq } from "drizzle-orm";
import { contacts } from "../database";
import { db } from "../db";

export class ContactDao {
  getContacts(user: { id: string }) {
    return db.select().from(contacts).where(eq(contacts.userId, user.id));
  }
}
