import { useMatches } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { useMemo } from "react";

export function useMatchesData<T>(id: string): SerializeFrom<T> | undefined {
  const matchingRoutes = useMatches();

  const route = useMemo(() => {
    if (!matchingRoutes) return null;

    return matchingRoutes.find((route) => route.id === id);
  }, [matchingRoutes, id]);
  return route?.data as SerializeFrom<T> | undefined;
}
