var express = require('express');
var router = express.Router();
var Model_Penerimaan = require('../model/Model_Penerimaan.js');
var Model_Produk = require('../model/Model_Produk.js');
var Model_Kategori = require('../model/Model_Kategori.js');
var Model_Users = require('../model/Model_Users.js');

// Menampilkan semua data penerimaan
router.get('/', async function (req, res, next) {
    try {
        let id = req.session.userId;
        let userData = await Model_Users.getId(id);
        if (userData.length > 0) {
            let rows = await Model_Penerimaan.getAll();
            let levelUser = req.session.level;
            res.render('penerimaan/index', {
                level: levelUser,
                data: rows
            });
        } else {
            req.flash('invalid', 'Anda harus login');
            res.redirect('/login');
        }
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada server');
        res.redirect('/login');
    }
});

// Menampilkan halaman pembuatan penerimaan
router.get('/create', async function (req, res, next) {
    try {
        let levelUser = req.session.level;
        let id = req.session.userId;
        let userData = await Model_Users.getId(id);
        let produkData = await Model_Produk.getAll();
        let kategoriData = await Model_Kategori.getAll();
        if (userData.length > 0) {
            if (userData[0].level_users == "1") {
                res.render('penerimaan/create', {
                    rows: userData,
                    data_produk: produkData,
                    data_kategori: kategoriData,
                    level: levelUser
                });
            } else {
                req.flash('failure', 'Anda bukan admin');
                res.redirect('/penerimaan');
            }
        } else {
            req.flash('invalid', 'Anda harus login');
            res.redirect('/login');
        }
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada server');
        res.redirect('/login');
    }
});

// Menyimpan data penerimaan baru
router.post('/store', async function (req, res, next) {
    try {
        let { tanggal_penerimaan, jumlah_diterima , id_produk , id_kategori} = req.body;
        let Data = {
            tanggal_penerimaan,
            jumlah_diterima,
            id_produk,
            id_kategori
        };
        await Model_Penerimaan.Store(Data);
        req.flash('success', 'Berhasil menyimpan data');
        res.redirect('/penerimaan');
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada server');
        res.redirect('/penerimaan');
    }
});

// Menampilkan halaman pengeditan penerimaan
router.get('/edit/(:id)', async function (req, res, next) {
    try {
        let levelUser = req.session.level;
        let idUser = req.session.userId;
        let id = req.params.id;
        let produkData = await Model_Produk.getAll();
        let kategoriData = await Model_Kategori.getAll();
        let penerimaanData = await Model_Penerimaan.getId(id);
        let userData = await Model_Users.getId(idUser);

        if (userData.length > 0) {
            if (userData[0].level_users == "1") {
                res.render('penerimaan/edit', {
                    id: penerimaanData[0].id_penerimaan,
                    tanggal_penerimaan: penerimaanData[0].tanggal_penerimaan,
                    jumlah_diterima: penerimaanData[0].jumlah_diterima,
                    id_produk: penerimaanData[0].id_produk,
                    id_kategori: penerimaanData[0].id_kategori,
                    data_produk: produkData,
                    data_kategori: kategoriData,
                    level: levelUser
                });
            } else {
                req.flash('failure', 'Anda bukan admin');
                res.redirect('/penerimaan');
            }
        } else {
            req.flash('invalid', 'Anda harus login');
            res.redirect('/login');
        }
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada server');
        res.redirect('/login');
    }
});

// Memperbarui data penerimaan
router.post('/update/(:id)', async function (req, res, next) {
    try {
        let id = req.params.id;
        let { id_produk, id_kategori,tanggal_penerimaan, jumlah_diterima } = req.body;
        let Data = {
            id_produk,
            id_kategori,
            tanggal_penerimaan,
            jumlah_diterima
        };
        await Model_Penerimaan.Update(id, Data);
        req.flash('success', 'Berhasil mengubah data');
        res.redirect('/penerimaan');
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada server');
        res.redirect('/penerimaan');
    }
});

// Menghapus data penerimaan
router.get('/delete/(:id)', async function (req, res) {
    try {
        let id = req.params.id;
        let idUser = req.session.userId;
        let userData = await Model_Users.getId(idUser);
        if (userData.length > 0) {
            if (userData[0].level_users == 1) {
                await Model_Penerimaan.Delete(id);
                req.flash('success', 'Berhasil menghapus data');
                res.redirect('/penerimaan');
            } else {
                req.flash('failure', 'Anda bukan admin');
                res.redirect('/penerimaan');
            }
        } else {
            req.flash('invalid', 'Anda harus login');
            res.redirect('/login');
        }
    } catch (error) {
        req.flash('error', 'Terjadi kesalahan pada server');
        res.redirect('/kategori');
    }
});

module.exports = router;
