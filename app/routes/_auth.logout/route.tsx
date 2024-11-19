import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { destroySession, getSession } from "~/.server/services/session-service";
import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("Logged out");

  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/login", {
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
