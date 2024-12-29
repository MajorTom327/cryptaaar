import { ClientOnly } from "remix-utils/client-only";
import { KeystoneConnect } from "./components/keystone-connect";

export default function AddHardwareWalletRoute() {
  return (
    <div>
      <ClientOnly>{() => <KeystoneConnect />}</ClientOnly>
    </div>
  );
}
