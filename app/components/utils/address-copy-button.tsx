import { Button } from "../ui/button";

export const AddressCopyButton: React.FC<{ address: string }> = ({
  address,
}) => {
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
