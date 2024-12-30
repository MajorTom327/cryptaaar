import { eq } from "drizzle-orm";
import { head } from "rambda";
import { match, P } from "ts-pattern";
import { User } from "~/types";
import { SimpleHashChain } from "~/types/simple-hash/sh-chains";
import { Contact, contacts } from "../database";
import { db } from "../db";
import { EnsService } from "../services/data/ens-service";

export class ContactDao {
  createContact(
    id: any,
    data: {
      name: string;
      description: string;
      address: string | null;
      ens: string | null;
      network: SimpleHashChain;
    }
  ) {
    return db.insert(contacts).values({
      label: data.name,
      network: data.network,
      ens: data.ens,
      address: data.address,
      userId: id,
      description: data.description,
    });
  }
  getContacts(user: User) {
    const ensService = new EnsService(user);
    return db
      .select()
      .from(contacts)
      .where(eq(contacts.userId, user.id))
      .then((contacts) => {
        return Promise.all(
          contacts.map(async (contact) => {
            const data = await match({
              ens: contact.ens,
              address: contact.address,
            })
              .with({ ens: P.string, address: P.string }, ({ ens, address }) =>
                Promise.resolve([{ ens, address }])
              )
              .with({ ens: P.string, address: P.nullish }, ({ ens }) =>
                ensService.getAddressForEns(ens)
              )
              .with({ ens: P.nullish, address: P.string }, ({ address }) =>
                ensService.getEnsForAddress(address)
              )
              .otherwise(() => Promise.resolve([]));

            const item = head(data);
            if (!item) return contact;

            return {
              ...contact,
              address: item.address,
              ens: item.ens,
            };
          })
        ).then((contacts) => {
          return contacts.filter(
            (contact) => contact.address !== null
          ) as Array<Contact & { address: string; ens: string | null }>;
        });
      });
  }
}
