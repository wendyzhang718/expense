/**
 * Snowflake 数据库连接工具
 */

import snowflake from 'snowflake-sdk';

/**
 * 创建 Snowflake 连接
 */
export function createConnection() {
  return snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT!,
    username: process.env.SNOWFLAKE_USER!,
    password: process.env.SNOWFLAKE_PASSWORD!,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE!,
    database: process.env.SNOWFLAKE_DATABASE!,
    schema: process.env.SNOWFLAKE_SCHEMA!,
    role: process.env.SNOWFLAKE_ROLE!,
  });
}

/**
 * 执行 SQL 查询
 * @param query SQL 查询语句
 * @returns 查询结果
 */
export async function executeQuery<T>(query: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const connection = createConnection();
    
    connection.connect((err, conn) => {
      if (err) {
        console.error('Snowflake connection error:', err);
        reject(err);
        return;
      }

      console.log('Snowflake connected successfully');
      
      conn.execute({
        sqlText: query,
        complete: (err, stmt, rows) => {
          connection.destroy((destroyErr) => {
            if (destroyErr) {
              console.error('Error destroying connection:', destroyErr);
            }
          });
          
          if (err) {
            console.error('Snowflake query error:', err);
            reject(err);
          } else {
            console.log(`Query returned ${rows?.length || 0} rows`);
            resolve((rows || []) as T[]);
          }
        },
      });
    });
  });
}
