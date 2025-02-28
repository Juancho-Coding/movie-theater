import pg from "pg";
const { Pool } = pg;

let pool: pg.Pool | null;
/**
 * Initialize the db pool connection
 * depending if running on dev or prod, the environment variables
 * will differ
 */
export function initializePool() {
  const properties = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_DBNAME,
  };

  pool = new Pool(properties);
}

/**
 * Test if pool can establish a connection
 * @returns query if connection is established
 */
export function testConnection() {
  if (pool === null) return new Promise((_resolve, reject) => reject(null));
  return pool.query("SELECT 1");
}

/**
 * Wrapper function for making queries
 * @param text query text
 * @param params values
 * @returns query results
 */
//export async function dbQuery(text: string, params: any): Promise<pg.QueryResult<any>> {
export async function dbQuery(text: string, params: any) {
  if (pool === null) throw new Error("Connection object not initialized");
  try {
    return await pool.query(text, params);
  } catch (error) {
    throw new Error(`query:${text} params:${params}, error:${error as string}`);
  }
}

/**
 * Create an object to make queries trhat is able to work with transactions
 * @returns promise with a db client object
 */
export async function dbQueryWithClient(): Promise<pg.PoolClient> {
  if (pool === null)
    return new Promise((_resolve, reject) =>
      reject("Connection object not initialized")
    );

  return await pool.connect();
}
