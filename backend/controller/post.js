const Post = require("../model/Post");
const mongoose = require("mongoose");

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    console.log("posts", posts);
    res.status(200).json({
      status: "success",
      data: posts,
    }
  );
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to get the posts",
    })
  }
};

const createPost = async (req, res, next) => {
  try{
    const post = new Post({
      _id: new mongoose.Types.ObjectId(),
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
      date: req.body.date,
    });
    await post.save();
    res.status(201).json({
      status: "success",
      data: post,
    });
  }
  catch(err){
    res.status(500).json({
      status: "error",
      message: "Failed to create the post",
    })
  }
};

const getPost = async (req, res, next) => {
  try{
    const post = await Post.findById(req.params.id);
    console.log('post:', post);
    res.status(200).json({
      status: "success",
      data: post,
    });
  }
  catch(err){
    res.status(500).json({
      status: "error",
      message: "Failed to get the post",
    });
  }
}

const updatePost = async (req, res, next) => {
  try{
    const post = await Post.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      status: "success",
      data: post,
    });
  }catch(err){
    res.status(500).json({
      status: "error",
      message: "Failed to update the post",
    })
  }
}

const deletePost = async (req, res, next) => {
  try{
    const post = await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: post,
    })
  }catch(err){
    res.status(500).json({
      status: "error",
      message: "Failed to delete the post",
    })
  }
}

module.exports = {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
};