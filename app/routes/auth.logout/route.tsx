import { redirect } from "react-router";

import { Form } from "react-router";
import { destroySession, getSession } from "~/.server/services/session-service";
import { Button } from "~/components/ui/button";

import type { Route } from "./+types/route";

export const action = async ({ request }: Route.ActionArgs) => {
  console.log("Logged out");

  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export const LogoutPage = () => {
  return (
    <div>
      <Form method="post">
        <Button type="submit">Logout</Button>
      </Form>
    </div>
  );
};

export default LogoutPage;
