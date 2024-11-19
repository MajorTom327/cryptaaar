import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import { Web3Provider } from "~/contexts";
import { authenticator } from "~/.server/services/authenticator";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  return {
    user,
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Web3Provider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </Web3Provider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
