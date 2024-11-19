import { z } from "zod";
import { prop } from "rambda";
import { ethers } from "ethers";

export const BigNumberSchema = z
  .union([
    z
      .object({ type: z.literal("BigNumber"), hex: z.string() })
      .transform(prop("hex")),
    z.string(),
  ])
  .transform((v) => ethers.BigNumber.from(v));
