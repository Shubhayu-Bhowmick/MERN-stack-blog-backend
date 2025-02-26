const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async (req, res) => {
  const { content, postId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    const comment = await Comment.create({ content, author: req.user.id, post: postId });
    post.comments.push(comment._id);
    await post.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createComment };