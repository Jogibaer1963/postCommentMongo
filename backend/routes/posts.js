const express = require('express');
const Post = require("../models/post");
const multer = require('multer');


const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif'
};

const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images")
  },
  filename: function (req, file, cb) {
    const name = file.originalname.toLowerCase()
                      .split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post("", multer({ storage: storage }).single('image'),
  (req, res, next)=> {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "success",
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
      }
    })
  })

});

router.put("/:id", multer({ storage: storage }).single('image'),
  (req, res, next) => {
  let imagePath = req.body.imagePath;
    if (req.file) {
     const url = req.protocol + '://' + req.get('host');
     imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
  })
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({ message: "Post updated!" });
  })

})

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count;
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.get('/:id', (req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "Post not found!"});
    }
  })
})

router.delete("/:id", (req,
                              res,
                              next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
