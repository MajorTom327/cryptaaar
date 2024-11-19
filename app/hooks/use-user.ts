import { isNil } from "rambda";

import type { loader } from "~/root";
import { User } from "~/types";
import { useMatchesData } from "./use-matches-data";

export function useUser(): User | undefined {
  const data = useMatchesData<typeof loader>("root");
  if (!data || isNil(data.user)) {
    return undefined;
  }
  return data.user;
}
