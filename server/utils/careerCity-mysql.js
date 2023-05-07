// const mysql = require("mysql");

// // let dbConfig = {
// //   // Default is 10
// //   connectionLimit: 10,
// //   host: "35.203.160.212",
// //   user: "dviernes",
// //   password: "n3wAcc3ssiT0",
// //   database: "careercity",
// // };

// // let dbConfig = {
// //   // Default is 10
// //   connectionLimit: 10,
// //   host: "34.126.67.156",
// //   user: "dviernes",
// //   password: "gHPb9EFa0z4ze9Ls",
// //   database: "careercity",
// // };

// // let dbConfig = {
// //   // Default is 10
// //   connectionLimit: 10,
// //   host: "localhost",
// //   user: "root",
// //   password: "pass",
// //   database: "careercity-dev",
// // };

// // let dbConfig = {
// //   // Default is 10
// //   connectionLimit: 10,
// //   host: "localhost",
// //   user: "root",
// //   password: "telus@mysql",
// //   database: "careercity",
// // };

// const pool = mysql.createPool(dbConfig);

// const connection = () => {
//   return new Promise((resolve, reject) => {
//     pool.getConnection((error, connection) => {
//       if (error) reject(error);
//       console.log("MySQL pool connected: threadId " + connection.threadId);
//       const query = (sql, binding) => {
//         return new Promise((resolve, reject) => {
//           connection.query(sql, binding, (error, result) => {
//             if (error) reject(error);
//             resolve(result);
//           });
//         });
//       };
//       const release = () => {
//         return new Promise((resolve, reject) => {
//           if (error) reject(error);
//           console.log("MySQL pool released: threadId " + connection.threadId);
//           resolve(connection.release());
//         });
//       };
//       resolve({ query, release });
//     });
//   });
// };

// const query = (sql, binding) => {
//   return new Promise((resolve, reject) => {
//     pool.query(sql, binding, (error, result, fields) => {
//       if (error) reject(error);
//       resolve(result);
//     });
//   });
// };

// module.exports = { pool, connection, query };
