import { z } from "zod";
import { v7 } from "uuid";

export const typeid = (prefix: string): string => {
  const cleanPrefix = z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-zA-Z0-9_]+$/)
    .parse(prefix);

  const id = v7().replace(/-/g, "");

  return `${cleanPrefix}-${id}`;
};
