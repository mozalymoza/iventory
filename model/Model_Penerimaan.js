const connection = require('../config/database');

class Model_Penerimaan {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT a.*, b.nama_produk, c.nama_kategori
            FROM penerimaan as a
            JOIN produk as b ON b.id_produk = a.id_Produk
            JOIN kategori as c ON c.id_kategori = a.id_kategori`, (err, rows) => {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async Store(Data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO penerimaan SET ?', Data, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM penerimaan WHERE id_penerimaan = ?', id, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE penerimaan SET ? WHERE id_penerimaan = ?', [Data, id], function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM penerimaan WHERE id_penerimaan = ?', id, function (err, result) {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    resolve(result);
                }
            })
        });
    }

}

module.exports = Model_Penerimaan;
