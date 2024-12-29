import { useLoaderData } from "react-router";
import { ContactDao } from "~/.server/dao/contact-dao";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { Route } from "./+types/route";

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
  return <div>{contacts.length} contacts</div>;
};

export default ContactLayoutroute;
