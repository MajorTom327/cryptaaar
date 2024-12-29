"use client";
import { TransportWebUSB } from "@keystonehq/hw-transport-webusb";
import { useCallback, useEffect, useState } from "react";
import { useHydrated } from "remix-utils/use-hydrated";

export const useTransport = () => {
  const isClient = useHydrated();
  const [transport, setTransport] = useState<TransportWebUSB | null>(null);

  const getTransport = useCallback(async () => {
    if (!isClient) return;

    /**
     * 1. Request permission to access the device.
     */
    if ((await TransportWebUSB.getKeystoneDevices()).length <= 0) {
      console.log("no device");
      await TransportWebUSB.requestPermission();
    }

    /**
     * 2. Connect to the device.
     */
    const transport = await TransportWebUSB.connect({
      timeout: 100000,
    });

    setTransport(() => transport);
    console.log("Loaded transport", transport);
  }, [isClient, setTransport]);

  useEffect(() => {
    console.log("isClient", isClient);

    getTransport();
  }, [isClient]);

  return { transport };
};
