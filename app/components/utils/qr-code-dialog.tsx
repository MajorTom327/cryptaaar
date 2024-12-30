import { QRCodeSVG } from "qrcode.react";
import { PropsWithChildren } from "react";
import { ClientOnly } from "remix-utils/client-only";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { DialogHeader } from "../ui/dialog";
import { AddressCopyButton } from "./address-copy-button";

type QrCodeDialogProps = PropsWithChildren<{
  address: string;
}>;

export const QrCodeDialog: React.FC<QrCodeDialogProps> = ({
  address,
  children,
}) => {
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
                value={address}
                level={"H"}
                marginSize={4}
              />
              <AddressCopyButton address={address} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </ClientOnly>
  );
};
