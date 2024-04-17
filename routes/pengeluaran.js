var express = require('express');
var router = express.Router();
var connection = require('../config/database.js');
const Model_Pengeluaran = require('../model/Model_Pengeluaran.js');
const Model_Users = require('../model/Model_Users.js');
const Model_Produk = require('../model/Model_Produk.js');
const Model_Kategori = require('../model/Model_Kategori.js');

router.get('/', async function (req, res, next) {
    try {
        let id = req.session.userId;
        let Data = await Model_Users.getId(id);
        if (Data.length > 0) {
            let rows = await Model_Pengeluaran.getAll();
            res.render('pengeluaran/index', {
                level: req.session.level,
                data: rows
            })
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        res.redirect('/login')
    }
})

router.get('/create', async function (req, res, next) {
    try {
        let level_users = req.session.level;
        let id = req.session.userId;
        let Data = await Model_Users.getId(id);
        let rows = await Model_Produk.getAll(id);
        let datakategori = await Model_Kategori.getAll(id);
        if(Data[0].level_users == "1") {
        res.render('pengeluaran/create', {
            tanggal_pengeluaran: '',
            jumlah_dikeluarkan: '',
            id_produk: '',    
            data: rows,
            data_kategori: datakategori,
            level: level_users
        })
        }
        else if (Data[0].level_users == "2"){
            req.flash('failure', 'Anda bukan admin');
            res.redirect('/pengeluaran')
        }
    } catch (Data) {
        req.flash('invalid', 'Anda harus login');
        console.log(Data);
        res.redirect('/login');
    }
    })

router.post('/store', async function (req, res, next) {
    try {
        let { tanggal_pengeluaran, jumlah_dikeluarkan,id_produk, id_kategori} = req.body;
        let Data = {
            tanggal_pengeluaran,
            jumlah_dikeluarkan,
            id_produk,
            id_kategori
        }
        await Model_Pengeluaran.Store(Data);
        req.flash('success', 'Berhasil menyimpan data');
        res.redirect('/pengeluaran');
    } catch {
        req.flash('error', 'Terjadi kesalahan pada fungsi')
        res.redirect('/pengeluaran')
    }
})
router.get('/edit/(:id)', async function (req, res, next) {
    try{
        let level_users = req.session.level;
        let id = req.params.id;
        let id_users = req.session.userId;
        let rows = await Model_Pengeluaran.getId(id);
        let rows2 = await Model_Produk.getAll();
        let datakategori = await Model_Kategori.getAll();
        let Data = await Model_Users.getId(id_users);
        if(Data[0].level_users == "1") {
        res.render('pengeluaran/edit', {
            id: rows[0].id_pengeluaran,
            tanggal_pengeluaran: rows[0].tanggal_pengeluaran,
            jumlah_dikeluarkan: rows[0].jumlah_dikeluarkan,
            data_produk: rows2,
            data_kategori: datakategori,
            id_produk: rows[0].id_produk,
            id_kategori: rows[0].id_kategori,
            harga_produk: rows[0].harga_produk,
            level: level_users
        })
        }
        else if (Data[0].level_users == "2"){
            req.flash('failure', 'Anda bukan admin');
            res.redirect('/pengeluaran')
        }
    } catch {
        req.flash('invalid', 'Anda harus login');
        res.redirect('/login')
    }
    })

router.post('/update/(:id)', async function (req, res, next) {
    try {
        let id = req.params.id;
        let { tanggal_pengeluaran, jumlah_dikeluarkan, id_produk , id_kategori} = req.body;
        let Data = {
            tanggal_pengeluaran: tanggal_pengeluaran,
            jumlah_dikeluarkan: jumlah_dikeluarkan,
            id_produk: id_produk,
            id_kategori: id_kategori
        }
        await Model_Pengeluaran.Update(id, Data);
        req.flash('success', 'Berhasil mengubah data');
        res.redirect('/pengeluaran')
    } catch {
        req.flash('error', 'terjadi kesalahan pada fungsi');
        res.redirect('/pengeluaran');
    }
})

router.get('/delete/(:id)', async function (req, res) {
    try{
        let id = req.params.id;
        let id_users = req.session.userId;
        let Data = await Model_Users.getId(id_users);
        if(Data[0].level_users == 1){
            await Model_Pengeluaran.Delete(id);
            req.flash('success', 'Berhasil menghapus data');
            res.redirect('/pengeluaran')
        }
        else if(Data[0].level_users == 2){
            req.flash('failure', 'Anda bukan admin');
            res.redirect('/pengeluaran')
        }
        } catch {
            req.flash('error', 'terjadi kesalahan pada fungsi');
            res.render('/kategori');
        }
    })
module.exports = router;