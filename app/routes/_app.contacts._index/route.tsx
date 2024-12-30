import { useLoaderData } from "react-router";
import { ContactDao } from "~/.server/dao/contact-dao";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { Route } from "./+types/route";
import { ContactCard } from "./components/contact-card";

export { ErrorBoundary } from "~/components/error-boundary";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await preventNotConnected(request);

  const contacts = await new ContactDao().getContacts(user!);

  return {
    contacts,
  };
}
export const ContactLayoutroute = () => {
  const { contacts } = useLoaderData<typeof loader>();
  return (
    <>
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </>
  );
};

export default ContactLayoutroute;
