export const addressFormatter = (address: string) => {
  const first = address.slice(0, 6);
  const last = address.slice(-4);
  return `${first}-${last}`;
};

export const AddressFormat: React.FC<{ address: string }> = ({ address }) => {
  return <>{addressFormatter(address)}</>;
};
