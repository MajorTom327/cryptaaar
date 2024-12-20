import { QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { PropsWithChildren } from "react";
import { ClientOnly } from "remix-utils/client-only";
import { match, P } from "ts-pattern";
import { UserAddress } from "~/.server/database";
import { AddressFormat } from "~/components/formatters/address-format";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
type Props = {
  address: UserAddress & { ens: string | null };
};

const AddressCopyButton: React.FC<{ address: string }> = ({ address }) => {
  const onCopyAddress = () => {
    navigator.clipboard.writeText(address);
  };
  return (
    <Button
      variant="ghost"
      onClick={onCopyAddress}
      className="font-mono"
      size="sm"
    >
      {address}
    </Button>
  );
};

const AddressTitle: React.FC<{
  address: UserAddress & { ens: string | null };
}> = ({ address }) => {
  return match(address)
    .with({ ens: P.string }, ({ ens }) => ens)
    .with({ label: P.string }, ({ label }) => label)
    .otherwise(() => <AddressFormat address={address.address} />);
};

export const AddressListItem: React.FC<Props> = ({ address }) => {
  return (
    <div className="flex gap-4 border rounded-lg p-4">
      <QrCodeDialog address={address}>
        <Button
          variant="accent"
          className="rounded-full p-4 h-16 aspect-square text-4xl"
        >
          <QrCode className="!size-6" />
        </Button>
      </QrCodeDialog>
      <div className="flex flex-col gap-2">
        <div className="flex gap-6 items-center ml-2">
          <div className="font-mono text-2xl">
            <AddressTitle address={address} />
          </div>
          <div className="flex gap-2">
            {address.isMain && <Badge>Main</Badge>}
            {address.isHardware && <Badge variant="outline">Hardware</Badge>}
          </div>
        </div>
        <AddressCopyButton address={address.address} />
      </div>
    </div>
  );
};

type QrCodeDialogProps = PropsWithChildren<{
  address: UserAddress;
}>;

const QrCodeDialog: React.FC<QrCodeDialogProps> = ({ address, children }) => {
  return (
    <ClientOnly>
      {() => (
        <Dialog>
          <DialogTrigger>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Qr Code</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center flex-col items-center">
              <QRCodeSVG
                size={256}
                value={address.address}
                level={"H"}
                marginSize={4}
              />
              <AddressCopyButton address={address.address} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </ClientOnly>
  );
};
