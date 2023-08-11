const router = require('express').Router();
const BlogModel = require('../models/blog.model');
const UserModel = require('../models/user.model');
const moment = require('moment');
const { getWordCount, getTags, getUserIdFromToken } = require('../services/blog.services')



//create post
module.exports.createBlogPost = async(req, res) => {
    try {
        const { title, description, tags, body } = req.body;

        const read_count = 0;
        let sanitized_tags = !tags ? ["untagged post"] : getTags(tags);
        sanitized_tags.push("post");
        const read_time = getWordCount(body) * process.env.TIMEPERWORD;

        const payload = {
                timestamp: moment().toDate(),
                title: title.toLowerCase(),
                description,
                tags: sanitized_tags,
                author: getUserIdFromToken(req.headers.token),
                read_count,
                read_time,
                body,
                state: 'draft'

            }
            // //validation of content


        if (!title || !body) {
            return res.status(409).json({ message: "Please enter a title and content" });
        }

        const blogpost = await BlogModel.create(payload);
        if (blogpost) {
            return res.status(200).json({ message: "successfully posted", blogpost: blogpost })
        }

        return res.status(500).json({ message: "We encountered a problem creating the blog post, please try again" });
    } catch (error) {
        return res.status(409).json({ message: "An error occurred: " + error.message });
        console.log(error);
    }

};
//get all published posts: point 5
module.exports.getPublishedPosts = async(req, res) => {

    const { page, posts, author, title, tags, order_by, order } = req.query;
    const searchQuery = { state: 'published' },
        sortQuery = {};

    let searchtags = [];
    //Pagination
    const startpage = (!page ? 0 : page);
    const postsPerPage = (!posts ? 20 : posts);
    const sortOrder = (!order ? "asc" : order);
    const orderParams = (!order_by ? "timestamp" : order_by);
    //Searching
    searchtags = (!tags ? ["post"] : getTags(tags));
    if (author) {
        searchQuery.author = author;

    }

    if (title) {
        searchQuery.title = title.toLowerCase();
    }

    //Sorting

    sortParams = orderParams.split(",");
    for (const param of sortParams) {

        if (sortOrder == "asc" && order_by) {
            sortQuery[param] = 1;
        }
        if (sortOrder == "desc" && order_by) {
            sortQuery[param] = -1;
        }
        if (sortOrder == "desc" && !order_by) {
            sortQuery[param] = -1;
        }
        if (sortOrder == "asc" && !order_by) {
            sortQuery[param] = 1;
        }

    }



    const blog = await BlogModel
        .find({ tags: { $in: searchtags }, ...searchQuery })
        .sort(sortQuery)
        .skip(startpage)
        .limit(postsPerPage);


    if (!blog) {
        res.status(401).json({ message: "Sorry , there are currently no published posts" });
        res.end();
    }
    if (blog.length === 0) {
        res.status(409).json({ message: "Sorry , there are currently no published posts that match your search criteria" });
        res.end();
    } else {
        return res.status(200).json({ blog });
    }

};
//get published post by id: point 6
module.exports.getPublishedPost = async(req, res) => {
    try {
        const { id } = req.params;
        const blog = await BlogModel.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Sorry , this post was not found." });
        }
        const user = await UserModel.findById(blog.author);
        blog.read_count++;
        await blog.save()
        return res.status(200).json({ blog, user });
    } catch (err) {
        return res.status(404).json({ message: "Please check post id and try again" });
    }
};
//update a post state
module.exports.updatePostState = async(req, res) => {
    const { id } = req.params;
    const userId = getUserIdFromToken(req.headers.token);
    const blog = await BlogModel.findById(id);
    if (!blog) {
        return res.status(404).json({ status: false, message: "Post does not exist" })
    }
    if (blog.author === userId) {
        blog.state = 'published';
        await blog.save();
        return res.status(200).json({ message: "Post state update successfully to published", blog: blog });
    }

    return res.status(403).json({ message: "Unauthorized to update this post" });





};
//update a post
module.exports.updatePost = async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tags, body } = req.body;


        if (!title || !body) {
            return res.status(409).json({ message: "Please enter a title and content" });
        }
        if (!description || !tags) {
            return res.status(409).json({ message: "Please enter a description and tags" });
        }
        let sanitized_tags = getTags(tags);
        sanitized_tags.push("post");
        const userId = getUserIdFromToken(req.headers.token);
        const blog = await BlogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ status: false, message: "Post does not exist" })
        }

        if (blog.author === userId) {
            blog.title = title;
            blog.description = description;
            blog.tags = sanitized_tags;
            blog.body = body;
            blog.read_time = getWordCount(body) * process.env.TIMEPERWORD;
            await blog.save();
            return res.status(200).json({ message: "updated successfully", blog: blog });
        }

        return res.status(403).json({ message: "Unauthorized to update this post" });

    } catch (err) {
        return res.status(403).json({ message: err });
    }



};
//delete a post
module.exports.deletePost = async(req, res) => {
    const { id } = req.params;
    const userId = getUserIdFromToken(req.headers.token);
    const blog = await BlogModel.findById(id);



    if (!blog) {
        return res.status(404).json({ status: false, message: "Post does not exist" })
    }

    if (blog.author === userId) {

        const post = await BlogModel.deleteOne({ _id: id })

        return res.json({ status: true, message: "Post deleted successfully" })
    }

};

module.exports.getUserPosts = async(req, res) => {
    const {
        page,
        posts,
        state,
        order
    } = req.query;
    const searchQuery = {};

    //Pagination
    const startpage = (!page ? 0 : page);
    const postsPerPage = (!posts ? 10 : posts);
    const sortOrder = (!order ? "asc" : order);
    const stateParam = (!state ? "draft" : state);

    //Searching
    searchQuery.author = getUserIdFromToken(req.headers.token);
    searchQuery.state = stateParam;


    //Sorting

    const blog = await BlogModel.find(searchQuery)
        .sort(sortOrder)
        .skip(startpage)
        .limit(postsPerPage);
    if (!blog) {
        return res.status(404).json({ status: false, message: "This user does not have any posts" })
    }

    return res.status(200).json({ blog: blog });
};