let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_iventory_pangan',
});
connection.connect(function(error){
    if(!!error){
        console.log(error)
    }else{
        console.log('connection Succsess')
    }
})

module.exports = connection;
