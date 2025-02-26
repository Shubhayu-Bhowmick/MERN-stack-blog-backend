const Post = require('../models/Post');

const createPost = async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const post = await Post.create({ title, content, tags, author: req.user.id });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPosts = async (req, res) => {
    const { tag } = req.query;
    try {
      const query = tag ? { tags: tag } : {};
      const posts = await Post.find(query).populate('author', 'username').sort({ createdAt: -1 });
      res.json(posts);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const updatePost = async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new Error('Post not found');
    if (post.author.toString() !== req.user.id) throw new Error('Not authorized');
    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new Error('Post not found');
    if (post.author.toString() !== req.user.id) throw new Error('Not authorized');
    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPostById = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate('author', 'username')
        .populate('comments');
      if (!post) throw new Error('Post not found');
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

module.exports = { createPost, getPosts, updatePost, deletePost, getPostById };