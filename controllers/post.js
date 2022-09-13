const featuredPost = require("../models/featuredPost");
const Post = require("../models/post");
const cloudinary = require("../cloud");
const { isValidObjectId } = require("mongoose");
const post = require("../models/post");

const addToFeaturedPost = async (postId) => {
  const fpAlreadyExists = await featuredPost.findOne({ post: postId });
  if (fpAlreadyExists) return;
  // res.status(401).json({ error: "featured post exists alraedy" });
  const fp = new featuredPost({ post: postId });
  await fp.save();

  const fps = await featuredPost.find({}).sort({ createdAt: -1 });
  fps.forEach(async (post, index) => {
    if (index >= 4) await featuredPost.findByIdAndDelete(post._id);
  });
};

const removeFeaturedPost = async (postId) => {
  await featuredPost.findOneAndDelete({ post: postId });
};

const isFeaturedPost = async (postId) => {
  return (await featuredPost.findOne({ post: postId })) ? true : false;
};

exports.createPost = async (req, res) => {
  const { title, meta, content, slug, author, tags, featured } = req.body;

  const slugAlreadyExists = await Post.findOne({ slug });
  if (slugAlreadyExists) res.status(401).json({ error: "slug exists alraedy" });

  const { file } = req || {};

  const newPost = new Post({ title, meta, content, slug, author, tags });
  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );

    newPost.thumbnail = { url, public_id };
  }

  await newPost.save();

  if (featured) {
    await addToFeaturedPost(newPost._id);
  }

  res.json(newPost);
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) res.status(401).json({ error: "bad request" });

  const findPost = await Post.findById(postId);
  if (!findPost) res.status(401).json({ error: "post not found" });

  const { public_id } = findPost.thumbnail || {};
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result != "ok")
      res.status(401).json({ error: "couldn't remove thumbnail" });
  }

  await Post.findByIdAndDelete(postId);
  await removeFeaturedPost(postId);
  res.json({ message: "post removed" });
};

exports.updatePost = async (req, res) => {
  const { title, meta, content, slug, author, tags, featured } = req.body;

  const { file } = req || {};

  const { postId } = req.params;

  if (!isValidObjectId(postId)) res.status(401).json({ error: "bad request" });

  const post = await Post.findById(postId);
  if (!post) res.status(401).json({ error: "post not found" });

  const { public_id } = post.thumbnail || {};

  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result != "ok")
      res.status(401).json({ error: "couldn't remove thumbnail" });
  }

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );

    post.thumbnail = { url, public_id };
  }
  console.log("post", post);

  post.title = title;
  post.meta = meta;
  post.content = content;
  post.slug = slug;
  post.author = author;
  post.tags = tags;
  //   post.title = title

  if (featured) await addToFeaturedPost(post._id);
  else await removeFeaturedPost(post._id);

  await post.save();

  res.json({ post });
};

exports.getPost = async (req, res) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) res.status(401).json({ error: "bad request" });

  const post = await Post.findById(postId);
  if (!post) res.status(401).json({ error: "post not found" });
  const featured = await isFeaturedPost(post._id);
  console.log("featured", post);

  res.json({ post, featured });
};

exports.getFeaturedPost = async (req, res) => {
  const fps = await featuredPost
    .find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .populate("post");
  res.json({ posts: fps });
};

exports.getPaginatedPost = async (req, res) => {
  const { pageNo, limit } = req.query;
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(limit);

  res.json({ posts });
};

exports.searchPost = async (req, res) => {
  const { title } = req.query;
  if (!title.trim()) res.status(401).json({ error: "no search query" });

  const posts = await Post.find({ title: { $regex: title, $option: "i" } });
  res.json({ posts });
};
exports.getRelatedPosts = async (req, res) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) res.status(401).json({ error: "bad request" });

  const post = Post.findById(postId);
  if (!post) res.status(404).json({ error: "post not found" });
  const relatedPosts = await Post.find({
    tags: { $in: [...post.tags] },
    _id: { $ne: post._id },
  })
    .sort("-createdAt")
    .limit(5);
};

exports.uploadImage = async (req, res) => {
  const { file } = req || {};

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path
    );
  }
  res.status(201).json({ image: url });
};
