import { isRouteErrorResponse } from "react-router";

import { propOr } from "rambda";
import { useRouteError } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Card className={"w-1/2"}>
          <CardHeader>
            <CardTitle>Oops</CardTitle>
            <CardDescription>
              Status {error.status} - {error.statusText}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error.data.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  const errorMessage = propOr("Unknown error", "message", error as any);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className={"w-1/2"}>
        <CardHeader>
          <CardTitle>Oops</CardTitle>
          <CardDescription>Something went wrong.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{errorMessage}</p>
        </CardContent>
      </Card>
    </div>
  );
}
