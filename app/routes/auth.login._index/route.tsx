import { Link, redirect, useFetcher } from "react-router";
import { authenticator } from "~/.server/services/authenticator";
import { sessionStorage } from "~/.server/services/session-service";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/route";
export { ErrorBoundary } from "~/components/error-boundary";

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

export async function action({ request }: Route.ActionArgs) {
  const user = await authenticator.authenticate("user-pass", request);

  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  session.set("user", user);

  throw redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}
