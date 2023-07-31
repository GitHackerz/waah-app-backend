const Post = require('../models/post');
const mongoose = require('mongoose');
const { canDeleteComment, canUpdateComment, canUpdatePost, canDeletePost } = require('../utils/post');

const GetPosts = async(req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'name avatar').populate('comments.author', 'name avatar');
        res.send(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const GetPost = async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.default.isValidObjectId(id))
            return res.status(400).json({ error: 'ID Not Valid' });

        const post = await Post.findById(id).populate('author', 'name avatar');
        if (!post)
            return res.status(404).json({ error: 'Post not found' });

        res.json({ post });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const AddPost = async(req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();

        res.status(201).json({ post });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const UpdatePost = async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.default.isValidObjectId(id))
            return res.status(400).json({ error: 'ID Not Valid' });

        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPost)
            return res.status(404).json({ error: 'Post not found' });

        if (!canUpdatePost(req, updatedPost))
            return res.status(401).json({ error: 'Access denied. You are not allowed to update this post' });

        res.json({ message: 'Post updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const DeletePost = async(req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.default.isValidObjectId(id))
            return res.status(400).json({ error: 'ID Not Valid' });

        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost)
            return res.status(404).json({ error: 'Post not found' });

        if (!canDeletePost(req, deletedPost))
            return res.status(401).json({ error: 'Access denied. You are not allowed to delete this post' });

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const AddComment = async(req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!mongoose.default.isValidObjectId(id))
            return res.status(400).json({ error: 'ID Not Valid' });

        const post = await Post.findById(id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });

        post.comments.push({
            author: req.payload.user._id,
            content
        });
        await post.save();

        res.json({ message: 'Comment added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const UpdateComment = async(req, res) =>{
    try {
        const { id, commentId } = req.params;
        const { content } = req.body;

        if (!mongoose.default.isValidObjectId(id))
            return res.status(400).json({ error: 'ID Not Valid' });

        const post = await Post.findById(id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });

        const comment = post.comments.find(comment => comment._id.toString() === commentId);
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });

        if (!canUpdateComment(req, post, commentId))
            return res.status(401).json({ error: 'Access denied. You are not allowed to update this comment' });

        comment.content = content;
        await post.save();

        res.json({ message: 'Comment updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const DeleteComment = async(req, res) => {
    try {
        const { id, commentId } = req.params;

        if (!mongoose.default.isValidObjectId(id))
            return res.status(400).json({ error: 'ID Not Valid' });

        const post = await Post.findById(id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });

        const comment = post.comments.find(comment => comment._id.toString() === commentId);
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });

        if (!canDeleteComment(req, post, commentId))
            return res.status(401).json({ error: 'Access denied. You are not allowed to delete this comment' });

        post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
        await post.save();

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const LikePost = async(req, res) => {
    const { id } = req.params;
    const { user } = req.payload;

    try {
        if (!mongoose.default.isValidObjectId(id))
            return res.status(400).json({ error: 'ID Not Valid' });

        const post = await Post.findById(id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });

        if (post.likes.includes(user._id))
            return res.status(400).json({ error: 'You already liked this post' });

        post.likes.push(user._id);
        await post.save();

        res.json({ message: 'Post liked successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const UnlikePost = async(req, res) => {
    const { id } = req.params;
    const { user } = req.payload;

    try {
        if (!mongoose.default.isValidObjectId(id))
            return res.status(400).json({ error: 'ID Not Valid' });

        const post = await Post.findById(id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });

        if (!post.likes.includes(user._id))
            return res.status(400).json({ error: 'You have not liked this post yet' });

        post.likes = post.likes.filter(like => like.toString() !== user._id.toString());
        await post.save();

        res.json({ message: 'Post unliked successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    GetPosts,
    GetPost,
    AddPost,
    UpdatePost,
    DeletePost,
    AddComment,
    UpdateComment,
    DeleteComment,
    LikePost,
    UnlikePost
};