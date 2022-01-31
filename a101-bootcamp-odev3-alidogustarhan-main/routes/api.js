const express = require('express')
let router = express.Router();
const tableEndpoint = require('./tablecrud')

router.use('/crud',tableEndpoint) //localhost:3000/crud



module.exports = router;