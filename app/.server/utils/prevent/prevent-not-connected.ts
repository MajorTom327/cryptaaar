import { redirect } from "react-router";
import { sessionStorage } from "~/.server/services/session-service";

type PreventNotConnectedOptions = Partial<{
  skipFailureRedirect: boolean;
}>;

export async function preventNotConnected(
  request: Request,
  options: PreventNotConnectedOptions = {
    skipFailureRedirect: false,
  }
) {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let user = session.get("user");

  if (!user) {
    if (options.skipFailureRedirect) {
      return null;
    }
    throw redirect("/auth/login");
  }

  return user;
}
