import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Wallet } from "lucide-react";

export const NoWalletButton: React.FC = () => {
  return (
    <>
      <Alert variant={"destructive"}>
        <Wallet className="size-4" />

        <AlertTitle>It look like you don't have a wallet installed.</AlertTitle>
        <AlertDescription>
          <p>
            Please install{" "}
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              MetaMask
            </a>{" "}
            or{" "}
            <a
              href="https://www.coinbase.com/wallet"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Coinbase Wallet
            </a>
            .
          </p>
        </AlertDescription>
      </Alert>
    </>
  );
};
