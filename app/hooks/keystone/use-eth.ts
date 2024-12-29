import { Eth } from "@keystonehq/hw-app-eth";
import { useMemo } from "react";
import { useTransport } from "./use-transport";

export const useEth = () => {
  const { transport } = useTransport();

  console.log("transport", transport);

  const eth = useMemo(() => {
    console.log("Creating eth instance...");
    if (!transport) return null;
    // @ts-expect-error: We'll see later
    return new Eth(transport);
  }, [transport]);

  return { eth };
};
