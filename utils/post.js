const isAdmin = (req) => req.payload.user.role === 'admin';

const isSuperAdmin = (req) => req.payload.user.role === 'superadmin';

const isPostAuthor = (req, post) => req.payload.user._id === post.author;

const isCommentAuthor = (req, comment) => req.payload.user._id === comment.author;

const canDeletePost = (req, post) => isPostAuthor(req, post) || isAdmin(req) || isSuperAdmin(req);

const canUpdatePost = (req, post) => isPostAuthor(req, post) || isSuperAdmin(req);

const canDeleteComment = (req, post, commentId) => {
    const comment = post.comments.find(comment => comment._id.toString() === commentId);
    return isCommentAuthor(req, comment) || isAdmin(req) || isSuperAdmin(req);
};

const canUpdateComment = (req, post, commentId) => {
    const comment = post.comments.find(comment => comment._id.toString() === commentId);
    return isCommentAuthor(req, comment) || isSuperAdmin(req);
};

module.exports = {
    isAdmin,
    isSuperAdmin,
    isPostAuthor,
    isCommentAuthor,
    canUpdatePost,
    canUpdateComment,
    canDeletePost,
    canDeleteComment
};