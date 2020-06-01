const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

// const db = knex({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     port: 5432,
//     user : 'admin',
//     password : 'password',
//     database : 'payment-api'
//   }
// });

module.exports = db;
