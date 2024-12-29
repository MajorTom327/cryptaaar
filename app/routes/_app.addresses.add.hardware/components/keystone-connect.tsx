"use client";
import { useEth } from "~/hooks/keystone/use-eth";

export const KeystoneConnect = () => {
  const { eth } = useEth();

  console.log(eth);

  // const result = useMemo(async () => {
  //   if (!eth) return null;
  //   return await eth.getAddress("44'/60'/0'/0/0");
  // }, [eth]);

  // console.log("result", result);
  return <div>KeystoneConnect</div>;
};
