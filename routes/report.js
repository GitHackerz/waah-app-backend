const { Router } = require('express');
const { GetReports, AddReport, ResolveReport, DeleteReport } = require('../controllers/report');
const { auth, isSuperAdmin } = require('../middlewares/auth');

const router = Router();

router.route('/')
    .get(auth, isSuperAdmin, GetReports)
    .post(auth, AddReport);
router.put('/', auth, isSuperAdmin, ResolveReport);
router.delete('/:id', auth, isSuperAdmin, DeleteReport);

module.exports = router;