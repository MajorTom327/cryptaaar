import { useFetcher, useLoaderData } from "react-router";
import { useSigner } from "~/contexts";
import { useCallback, useState } from "react";
import { ActionFunctionArgs, data, LoaderFunctionArgs, redirect } from "react-router";
import { authenticator } from "~/.server/services/authenticator";
import { commitSession, getSession } from "~/.server/services/session-service";
import { z } from "zod";
import { ConnectButton } from "./components/connect-button";
import { AddressesDao } from "~/.server/dao/addresses-dao";
import { UserDao } from "~/.server/dao/user-dao";

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
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

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

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

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
