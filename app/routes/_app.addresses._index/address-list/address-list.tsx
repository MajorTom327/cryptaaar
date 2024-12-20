import { UserAddress } from "~/.server/database";
import { AddressListItem } from "./address-list-item";

type Props = {
  addresses: (UserAddress & { ens: string | null })[];
};

export const AddressList: React.FC<Props> = ({ addresses }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {addresses.map((address) => (
        <AddressListItem key={address.address} address={address} />
      ))}
    </div>
  );
};
