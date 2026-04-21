import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL!;

// Disable prefetch as it is not supported for "Transaction" mode (if using poolers like PgBouncer)
// though for a simple app it might not be strictly necessary, but it's safer.
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
