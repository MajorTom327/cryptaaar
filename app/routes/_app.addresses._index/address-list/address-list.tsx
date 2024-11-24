import { UserAddress } from "~/.server/database";
import { AddressListItem } from "./address-list-item";

type Props = {
  addresses: UserAddress[];
};

export const AddressList: React.FC<Props> = ({ addresses }) => {
  return (
    <ul>
      {addresses.map((address) => (
        <AddressListItem key={address.address} address={address} />
      ))}
    </ul>
  );
};
