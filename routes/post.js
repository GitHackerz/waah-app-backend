const { Router } = require('express');
const { AddPost, GetPosts, UpdatePost, GetPost, DeletePost, AddComment, DeleteComment, UnlikePost, LikePost } = require('../controllers/post');
const { auth } = require('../middlewares/auth');

const router = Router();

router.route('/')
    .get(GetPosts)
    .post(AddPost);
router.route('/:id')
    .get(GetPost)
    .put(UpdatePost)
    .delete(DeletePost);
router.route('/comment/:id')
    .post(auth, AddComment);
router.route('/comment/:id/:commentId')
    .delete(auth, DeleteComment);
router.route('/like/:id')
    .post(auth, LikePost)
    .delete(auth, UnlikePost);

module.exports = router;