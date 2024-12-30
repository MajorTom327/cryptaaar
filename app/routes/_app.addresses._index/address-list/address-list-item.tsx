import { QrCode } from "lucide-react";
import { match, P } from "ts-pattern";
import type { UserAddress } from "~/.server/database";
import { ChainBadge } from "~/components/chain-badge";
import { AddressFormat } from "~/components/formatters/address-format";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { AddressCopyButton } from "~/components/utils/address-copy-button";
import { QrCodeDialog } from "~/components/utils/qr-code-dialog";
type Props = {
  address: UserAddress & { ens: string | null };
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
      <QrCodeDialog address={address.address}>
        <Button
          variant="accent"
          className="rounded-full p-4 h-16 aspect-square text-4xl"
        >
          <QrCode className="!size-6" />
        </Button>
      </QrCodeDialog>
      <div className="grow flex flex-col gap-2">
        <div className="flex gap-6 items-start ml-2 justify-between w-full">
          <div className="font-mono text-2xl flex flex-col gap-2">
            <div className="px-2">
              <AddressTitle address={address} />
            </div>
            <div className="flex justify-start">
              <AddressCopyButton address={address.address} />
            </div>
          </div>
          <div className="flex gap-2">
            <ChainBadge chain={address.network} />
            {address.isMain && <Badge>Main</Badge>}
            {address.isHardware && <Badge variant="outline">Hardware</Badge>}
          </div>
        </div>
      </div>
    </div>
  );
};
