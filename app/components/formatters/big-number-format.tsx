import { BigNumberish, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";

type Props = {
  value: BigNumberish;
  decimals?: BigNumberish;
};

export const BigNumberToFormat = (
  value: BigNumberish,
  decimals?: BigNumberish,
) =>
  formatUnits(
    ethers.BigNumber.from(value),
    ethers.BigNumber.from(decimals ?? 18),
  );

export const BigNumberFormat: React.FC<Props> = ({ value, decimals }) => {
  return BigNumberToFormat(value, decimals);
};
