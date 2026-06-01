const express = require('express');
const router = express.Router();
const EmpresaController = require('../Controller/EmpresaController');

router.get('/', EmpresaController.list);
router.post('/', EmpresaController.create);

module.exports = router;