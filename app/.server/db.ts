import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { envService } from "./services/env-service";

const client = new pg.Client({
  connectionString: envService.env.DB_URL,
});

await client.connect();

export const db = drizzle(client);
