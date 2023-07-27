const Post = require('../models/post');

const AddPost = async(req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();

        res.status(201).send(post);
    } catch (err) {
        res.status(400).send(err.message);
    }
};