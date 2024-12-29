import { TransportWebUSB } from "@keystonehq/hw-transport-webusb";
import { useEffect, useState } from "react";
import { useHydrated } from "remix-utils/use-hydrated";

export const useTransport = () => {
  const isClient = useHydrated();
  const [transport, setTransport] = useState<TransportWebUSB | null>(null);

  useEffect(() => {
    console.log("isClient", isClient);
    const init = async () => {
      if (!isClient) return;
      await TransportWebUSB.requestPermission();
      const result = await TransportWebUSB.connect({ timeout: 100000 });
      setTransport(result);
      console.log("Loaded transport");
    };
    init();
  }, [isClient]);

  return { transport };
};
