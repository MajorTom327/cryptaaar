import { z } from "zod";

const publicEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  DB_URL: z.string(),
});
const envSchema = publicEnvSchema.extend({
  ALCHEMY_API_KEY: z.string(),
  SIMPLE_HASH_API_KEY: z.string(),
  REDIS_URI: z.string().default("redis://@127.0.0.1:6379"),
  SESSION_SECRET: z.string().default("change me"),
});

type EnvType = z.infer<typeof envSchema>;
type PublicEnvType = z.infer<typeof publicEnvSchema>;

const baseEnv = process.env;

class EnvService {
  public readonly env: EnvType;
  public readonly publicEnv: PublicEnvType;

  constructor() {
    this.env = envSchema.parse(baseEnv);
    this.publicEnv = publicEnvSchema.parse(baseEnv);
  }
}

export const envService = new EnvService();
