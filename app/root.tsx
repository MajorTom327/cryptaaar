import type { LoaderFunctionArgs } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from "react-router";

import { propOr } from "rambda";
import { authenticator } from "~/.server/services/authenticator";
import { Web3Provider } from "~/contexts";
import { TooltipProvider } from "./components/ui/tooltip";
import "./tailwind.css";

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
        <TooltipProvider>
          <Web3Provider>
            {children}
            <ScrollRestoration />
            <Scripts />
          </Web3Provider>
        </TooltipProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  console.log("error", error);
  return <div>Error {propOr(500, "status", error)}</div>;
};
