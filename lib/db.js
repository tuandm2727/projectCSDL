const { Client } = require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'csdl',
    password: '123456',
    port: 5432,
})
client.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected Successfully..!!!");
});

module.exports = client;
