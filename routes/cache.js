const { Router } = require('express');
const { clearCache } = require('../controllers/cache');

const router = Router();

router.get('/clear', [
], clearCache);

module.exports = router;