const router = require('express').Router();
const blogController = require('../controllers/blog.controllers');
const { isAuthorized } = require('../services/blog.services')


//create post
router.post('/create', isAuthorized, blogController.createBlogPost);

//get particular post by id
router.get('/published_post/:id', blogController.getPublishedPost);

//get published posts
router.get('/published_posts', blogController.getPublishedPosts)

//update particular post state
router.patch('/updatePostState/:id', isAuthorized, blogController.updatePostState);

//update particular post
router.patch('/editPost/:id', isAuthorized, blogController.updatePost);

//delete particular post
router.delete('/deletePost/:id', isAuthorized, blogController.deletePost);

//get particular user's posts
router.get('/userPosts', isAuthorized, blogController.getUserPosts);


module.exports = router;