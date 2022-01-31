const aws = require('aws-sdk');
const express = require('express')
let router = express.Router();

let tableCrudController = require('../controller/tablecrud');
const { createTable } = require('../services/tablecrud');



router.get('/create',tableCrudController.createTableController)
router.post('/add',tableCrudController.add);
router.get('/',tableCrudController.fetchAll);
router.get('/product/:id',tableCrudController.fetchSingleProductid);
router.get('/discount',tableCrudController.fetchDiscount);
router.put('/update/:id',tableCrudController.update);
router.delete('/delete/:id',tableCrudController.fetchDeleteDiscount,tableCrudController.delete);




module.exports = router;