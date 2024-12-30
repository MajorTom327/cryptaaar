import { ChevronRight, QrCode } from "lucide-react";
import { Link } from "react-router";
import { ContactDao } from "~/.server/dao/contact-dao";
import { ChainBadge } from "~/components/chain-badge";
import { Button } from "~/components/ui/button";
import { AddressCopyButton } from "~/components/utils/address-copy-button";
import { QrCodeDialog } from "~/components/utils/qr-code-dialog";

type Props = {
  contact: Awaited<ReturnType<ContactDao["getContacts"]>>[number];
};

export const ContactCard: React.FC<Props> = ({ contact }) => {
  return (
    <>
      <div className="flex gap-4 border rounded-lg p-4 relative">
        <QrCodeDialog address={contact.address}>
          <Button
            variant="accent"
            className="rounded-full p-4 h-16 aspect-square text-4xl"
          >
            <QrCode className="!size-6" />
          </Button>
        </QrCodeDialog>
        <div className="grow flex flex-col gap-2 ">
          <div className="flex gap-6 items-start ml-2 justify-between w-full">
            <div className="font-mono text-2xl flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-end">
                <div className="px-2">{contact.label}</div>
                {contact.ens && (
                  <div className="px-2 text-sm text-muted-foreground">
                    ({contact.ens})
                  </div>
                )}
              </div>
              <div className="flex justify-start">
                <AddressCopyButton address={contact.address} />
              </div>
            </div>
            <div className="flex gap-2">
              <ChainBadge chain={contact.network} />
            </div>
          </div>
        </div>

        <Link
          to={`./${contact.network}.${contact.address}`}
          className="absolute top-0 right-0 bottom-0 h-auto w-96 opacity-20 hover:opacity-70 p-2 flex justify-end items-center from-gray-100/10 to-gray-400/40 bg-gradient-to-r transition"
        >
          <ChevronRight className="!size-8" />
        </Link>
      </div>
    </>
  );
};
