import { useFetcher, useLoaderData } from "@remix-run/react";
import { useSigner } from "~/contexts";
import { useCallback, useState } from "react";
import {
  ActionFunctionArgs,
  data,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { authenticator } from "~/.server/services/authenticator";
import { commitSession, getSession } from "~/.server/services/session-service";
import { z } from "zod";
import { ConnectButton } from "~/routes/auth.login.wallet.software/components/connect-button";

const formDataSchema = z.object({
  message: z.object({
    data: z.string(),
    signature: z.string(),
  }),
  address: z.string(),
  token: z.string(),
});

type FormData = z.infer<typeof formDataSchema>;

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  const session = await getSession(request.headers.get("Cookie"));

  await authenticator.generateToken(session);

  return data(
    {
      token: session.get("token"),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
}

export const LoginWalletPage = () => {
  const data = useLoaderData<{ token: string }>();
  const signer = useSigner();
  const [isSigning, setIsSigning] = useState(false);
  const fetcher = useFetcher();

  const signIn = useCallback(async () => {
    setIsSigning(() => true);

    if (signer) {
      const address = await signer.getAddress();

      const input = {
        ...data,
        address,
      };

      const message = `\x19Ethereum Signed Message:\n${JSON.stringify(input)}`;
      signer
        .signMessage(message)
        .then((signature) => {
          const data: FormData = {
            message: {
              data: message,
              signature,
            },
            address,
            token: input.token,
          };

          fetcher.submit(data, { method: "POST", encType: "application/json" });
        })
        .catch((e) => {
          console.log(e);
          setIsSigning(() => false);
        });
    }
  }, [fetcher.submit, signer]);

  return (
    <div className="flex flex-col gap-2">
      <ConnectButton isSigning={isSigning} onClick={signIn} />
    </div>
  );
};

export default LoginWalletPage;

export async function action({ request }: ActionFunctionArgs) {
  const requestBody = await request.clone().json();

  const formData = formDataSchema.safeParse(requestBody);
  if (!formData.success) {
    console.log("ERROR", formData.error.issues);
    return data(formData.error.issues, {
      status: 400,
    });
  }

  const user = await authenticator.validateToken(request, formData.data);

  if (!user) {
    throw new Response("Unauthorized", {});
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("user", user);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
