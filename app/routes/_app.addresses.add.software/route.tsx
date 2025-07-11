import { useCallback, useState } from "react";
import { data, redirect, useFetcher, useLoaderData } from "react-router";
import { z } from "zod";
import { AddressesDao } from "~/.server/dao/addresses-dao";
import { UserDao } from "~/.server/dao/user-dao";
import { commitSession, getSession } from "~/.server/services/session-service";
import { preventNotConnected } from "~/.server/utils/prevent/prevent-not-connected";
import { useSigner } from "~/contexts";
import type { Route } from "./+types/route";
import { ConnectButton } from "./components/connect-button";
export { ErrorBoundary } from "~/components/error-boundary";

const formDataSchema = z.object({
  message: z.object({
    data: z.string(),
    signature: z.string(),
  }),
  address: z.string(),
  token: z.string(),
});

type FormData = z.infer<typeof formDataSchema>;

export async function loader({ request }: Route.LoaderArgs) {
  const user = await preventNotConnected(request);

  const session = await getSession(request.headers.get("Cookie"));
  const addressesDao = new AddressesDao();

  session.set("token", addressesDao.generateToken());

  return data(
    {
      token: session.get("token"),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
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

          fetcher.submit(data, {
            action: "/addresses/add/software",
            method: "POST",
            encType: "application/json",
          });
        })
        .catch((e) => {
          console.log(e);
          setIsSigning(() => false);
        });
    }
  }, [fetcher.submit, signer, data]);

  return (
    <div className="flex flex-col gap-2">
      <ConnectButton isSigning={isSigning} onClick={signIn} />
    </div>
  );
};

export default LoginWalletPage;

export async function action({ request }: Route.ActionArgs) {
  const user = await preventNotConnected(request);

  const requestBody = await request.clone().json();

  const formData = formDataSchema.safeParse(requestBody);
  if (!formData.success) {
    console.log("ERROR", formData.error.issues);
    return data(formData.error.issues, {
      status: 400,
    });
  }

  const { token, message, address } = formData.data;
  const session = await getSession(request.headers.get("Cookie"));

  const addressesDao = new AddressesDao();
  if (!addressesDao.verifyToken({ token, message, address }, session)) {
    throw new Response("Unauthorized", {});
  }

  const userDao = new UserDao();
  await userDao.addAddress(user!, address);

  user.addresses.push(address);

  session.set("user", user);
  session.unset("token");

  return redirect("/addresses", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
