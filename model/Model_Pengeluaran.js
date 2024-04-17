const connection = require('../config/database');

class Model_Pengeluaran {

    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT a.*, b.nama_produk, c.id_kategori, c.nama_kategori
            FROM pengeluaran AS a
            LEFT JOIN produk AS b ON b.id_produk = a.id_produk
            LEFT JOIN kategori AS c ON c.id_kategori = a.id_kategori
            ORDER BY a.id_pengeluaran DESC;
            `, (err, rows) => {
                if(err){
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async Store(Data){
        return new Promise((resolve, reject) => {
            connection.query('insert into pengeluaran set ?', Data, function(err, result){
                if(err){
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT *
            FROM pengeluaran a
            LEFT JOIN produk b ON b.id_produk = a.id_produk
            WHERE a.id_pengeluaran = ` + id, (err,rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('update pengeluaran set ? where id_pengeluaran =' + id, Data, function(err, result){
                if(err){
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('delete from pengeluaran where id_pengeluaran =' + id, function(err,result){
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

}


module.exports = Model_Pengeluaran;