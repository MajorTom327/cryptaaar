import { Link, Outlet } from "react-router";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export { ErrorBoundary } from "~/components/error-boundary";

export const ContactLayoutroute = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2  justify-between">
          <Button asChild variant="ghost">
            <Link prefetch="intent" to="/contacts">
              Contacts
            </Link>
          </Button>
          <Button asChild>
            <Link prefetch="intent" to="/contacts/add">
              Add contact
            </Link>
          </Button>
        </div>
        <Separator />
        <Outlet />
      </div>
    </>
  );
};

export default ContactLayoutroute;
