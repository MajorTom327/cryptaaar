import { UserAddress } from "~/.server/database";
import { Badge } from "~/components/ui/badge";

type Props = {
  address: UserAddress;
};

export const AddressListItem: React.FC<Props> = ({ address }) => {
  return (
    <li className="px-2 py-2 hover:bg-muted flex justify-between gap-2 cursor-pointer rounded-md">
      {address.address}
      {address.isMain && <Badge>Main</Badge>}
    </li>
  );
};
