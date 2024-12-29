import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Link, useFetcher } from "react-router";
import { ActionFunctionArgs } from "react-router";
import { authenticator } from "~/.server/services/authenticator";

export const AuthLoginLayout = () => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      action="/auth/login?index"
      className={"flex flex-col gap-2"}
    >
      <Input name="email" type="email" placeholder="Email" />
      <Input name="password" type="password" placeholder="Password" />

      <div className="flex flex-row gap-2 w-full justify-end">
        <Button asChild variant={"link"}>
          <Link prefetch={"intent"} to="/auth/register" viewTransition>
            Create an account
          </Link>
        </Button>
        <Button type="submit">Login</Button>
      </div>
    </fetcher.Form>
  );
};

export default AuthLoginLayout;

export async function action({ request }: ActionFunctionArgs) {
  return authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  });
}
