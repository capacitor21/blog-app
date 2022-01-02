const Post = require('../models/postModel')

//post
exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find() // Query all posts from mongo

        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: posts
        })
    } catch (err) {
        console.log(`Unexpected error retrieving posts from database ${err}`)

        res.status(500).json({
            status: 'failed',
            error: err
        })
    }
}


//post/:id
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id) // Query post with id

        res.status(200).json({
            status: 'success',
            data: post
        })
    } catch (err) {
        console.log(`Unexpected error retrieving post from database ${err}`)

        res.status(500).json({
            status: 'failed',
            error: err
        })
    }
}


exports.createPost = async (req, res, next) => {
    try {
        const post = await Post.create(req.body)

        res.status(201).json({
            status: 'success',
            data: post
        })
    } catch (err) {
        console.log(`Unexpected error inserting post to database ${err}`)

        res.status(500).json({
            status: 'failed',
            error: err
        })
    }
}


//post/:id
exports.updatePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true}) // Query post with id

        res.status(200).json({
            status: 'success',
            data: post
        })
    } catch (err) {
        console.log(`Unexpected error updating post in database ${err}`)

        res.status(500).json({
            status: 'failed',
            error: err
        })
    }
}


//post/:id
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: 'success',
        })
    } catch (err) {
        console.log(`Unexpected error deleting post from database ${err}`)

        res.status(500).json({
            status: 'failed',
            error: err
        })
    }
}