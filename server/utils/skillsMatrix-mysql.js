const mysql = require("mysql");

// let dbConfig = {
//   // Default is 10
//   connectionLimit: 10,
//   host: "34.87.15.124",
//   user: "root",
//   password: "tuDKtHGqlm5I3BMs",
//   database: "dev",
// };

// let dbConfig = {
//   // Default is 10
//   connectionLimit: 10,
//   host: "localhost",
//   user: "root",
//   password: "telus@mysql",
//   database: "skills_matrix_dev",
// };

let dbConfig = {
  // Default is 10
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "telus@mysql",
  database: "skillsmatrix_appcatalog",
  // database: "skills_matrix",
};

// let dbConfig = {
//   // Default is 10
//   connectionLimit: 10,
//   host: "34.87.15.124",
//   user: "root",
//   password: "tuDKtHGqlm5I3BMs",
//   database: "skills_matrix",
// };

const pool = mysql.createPool(dbConfig);

const connection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) reject(error);
      console.log("MySQL pool connected: threadId " + connection.threadId);
      const query = (sql, binding) => {
        return new Promise((resolve, reject) => {
          connection.query(sql, binding, (error, result) => {
            if (error) reject(error);
            resolve(result);
          });
        });
      };
      const release = () => {
        return new Promise((resolve, reject) => {
          if (error) reject(error);
          console.log("MySQL pool released: threadId " + connection.threadId);
          resolve(connection.release());
        });
      };
      resolve({ query, release });
    });
  });
};

const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (error, result, fields) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

module.exports = { pool, connection, query };
