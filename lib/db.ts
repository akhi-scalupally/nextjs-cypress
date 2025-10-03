import mysql from "mysql2/promise";

let pool: mysql.Pool | undefined;
let hasLoggedConnection = false;

export function getPool() {
  if (!pool) {
    // Use test database configuration when NODE_ENV is test
    const isTestEnv = process.env.NODE_ENV === 'test';
    
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST ,
      port: Number(process.env.MYSQL_PORT ),
      user: process.env.MYSQL_USER ,
      password: process.env.MYSQL_PASSWORD ,
      database: process.env.MYSQL_DATABASE ,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    // Try a quick ping and log once
    (async () => {
      try {
        const connection = await pool!.getConnection();
        await connection.ping();
        connection.release();
        if (!hasLoggedConnection) {
          hasLoggedConnection = true;
          // eslint-disable-next-line no-console
          console.log(
            `MySQL connected → ${process.env.MYSQL_HOST}:${
              Number(process.env.MYSQL_PORT )
            }/${process.env.MYSQL_DATABASE }${isTestEnv ? ' (TEST ENV)' : ''}`
          );
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("MySQL connection failed:", err);
      }
    })();
  }
  return pool;
}

export async function ensureAddressTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS address (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      line1 VARCHAR(255) NOT NULL,
      line2 VARCHAR(255) NULL,
      city VARCHAR(120) NOT NULL,
      state VARCHAR(120) NULL,
      postalCode VARCHAR(30) NOT NULL,
      country VARCHAR(120) NOT NULL,
      phone VARCHAR(60) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  const pool = getPool();
  await pool.query(sql);
}


