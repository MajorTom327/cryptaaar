import Redis from "ioredis";
import { Duration } from "luxon";
import { match } from "ts-pattern";
import { envService } from "./env-service";

export const CACHE_TTL_SHORT = match(envService.env.NODE_ENV)
  .with("development", () => Duration.fromObject({ minutes: 1 }))
  .with("test", () => Duration.fromObject({ seconds: 1 }))
  .with("production", () => Duration.fromObject({ minutes: 15 }))
  .exhaustive()
  .as("seconds");

export const CACHE_TTL_LONG = match(envService.env.NODE_ENV)
  .with("development", () => Duration.fromObject({ minutes: 2.5 }))
  .with("test", () => Duration.fromObject({ seconds: 1 }))
  .with("production", () => Duration.fromObject({ hours: 12 }))
  .exhaustive()
  .as("seconds");

export const redis = new Redis(envService.env.REDIS_URI);
