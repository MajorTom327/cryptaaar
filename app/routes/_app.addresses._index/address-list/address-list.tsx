import { UserAddress } from "~/.server/database";
import { AddressListItem } from "./address-list-item";

type Props = {
  addresses: (UserAddress & { ens: string | null })[];
};

export const AddressList: React.FC<Props> = ({ addresses }) => {
  return (
    <div className="flex flex-col gap-2">
      {addresses.map((address) => (
        <AddressListItem key={address.address} address={address} />
      ))}
    </div>
  );
};
