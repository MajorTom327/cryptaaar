import { useSigner } from "~/contexts";
import { Button } from "~/components/ui/button";
import { NoWalletButton } from "~/routes/auth.login.wallet.software/components/no-wallet-button";

export const ConnectButton: React.FC<
  {
    isSigning: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ isSigning, ...props }) => {
  const signer = useSigner();

  if (signer) {
    return (
      <Button size="lg" className={"w-full"} loading={isSigning} {...props}>
        Connect your wallet & Sign a message
      </Button>
    );
  }

  return <NoWalletButton />;
};
