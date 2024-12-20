import { z } from "zod";

const publicEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
});
const envSchema = publicEnvSchema.extend({
  ALCHEMY_API_KEY: z.string(),
  SIMPLE_HASH_API_KEY: z.string(),
  REDIS_URI: z.string().default("redis://@127.0.0.1:6379"),
  SESSION_SECRET: z.string().default("change me"),
});

type EnvType = z.infer<typeof envSchema>;
type PublicEnvType = z.infer<typeof publicEnvSchema>;

class EnvService {
  public readonly env: EnvType;
  public readonly publicEnv: PublicEnvType;

  constructor() {
    this.env = envSchema.parse(process.env);
    this.publicEnv = publicEnvSchema.parse(process.env);
  }
}

export const envService = new EnvService();
