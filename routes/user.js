const {Router} = require('express');
const {checkUserBody} = require('../middlewares/validator');
const {AddUser, UpdateUser, DeleteUser, GetUsers, GetUserById, Login} = require('../controllers/user');
const {auth} = require('../middlewares/auth');

const router = Router();

router.post('/', auth, checkUserBody, AddUser);
router.put('/:id', auth, UpdateUser);
router.delete('/:id', auth, DeleteUser);
router.get('/', auth, GetUsers);
router.get('/:id', auth, GetUserById);
router.post('/login', Login);

module.exports = router;