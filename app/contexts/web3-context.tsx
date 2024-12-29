import { ethers } from "ethers";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHydrated } from "remix-utils/use-hydrated";

const Web3Context = createContext<ethers.providers.Web3Provider | null>(null);

export const Web3Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const isClient = useHydrated();
  const provider = useMemo(() => {
    if (!isClient) return null;
    try {
      // @ts-expect-error: window ethereum is injected by MetaMask
      return new ethers.providers.Web3Provider(window?.ethereum);
    } catch (e) {
      return null;
    }
  }, [isClient]);

  return (
    <Web3Context.Provider value={provider}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  return useContext(Web3Context);
};

export const useSigner = () => {
  const provider = useWeb3();

  const [signer, setSigner] = useState<
    ethers.providers.JsonRpcSigner | undefined
  >();

  useEffect(() => {
    const p = async () => {
      if (!provider) return;
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(() => signer);
    };

    p();
  }, [provider]);

  return signer;
};
