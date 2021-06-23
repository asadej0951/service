const mysql = require('mysql')
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "server_db"
})
// connect db
db.connect((err) => {
    // เช็คว่า connect db ได้ไหม
    if (err) {
        console.log('error connecting...')
    } else {
        console.log('connect database success!!')
    }
})
module.exports = db