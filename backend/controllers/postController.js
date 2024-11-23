import Post from "../models/postModel.js";
import { Response } from "../utils/response.js"
import cloudinary from "cloudinary";
import { message } from "../utils/message.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {
    try {
        // Parsing body data
        const { image, caption, location, mentions } = req.body;

        // Checking body data
        if(!caption) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Check image
        if(!image) {
            return Response(res, 400, false, message.imageMissingMessage);
        }

        // Upload image to cloudinary
        let imageUpload = await cloudinary.v2.uploader.upload(image, {
            folder: 'posts'
        })

        // Create post
        let post = await Post.create({
            image: {
                public_id: imageUpload.public_id,
                url: imageUpload.url
            },
            caption, 
            location,
            mentions
        })

        // Set owner details
        post.owner = req.user._id;
        await post.save();

        // Set post in user
        let user = await User.findById(req.user._id);
        user.posts.unshift(post._id);
        await user.save();

        // Send Response
        Response(res, 201, true, message.postCreatedMessage, post);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getAllPosts = async (req, res) => {
    try {
        // Find all posts
        const posts = await Post.find().populate('owner', 'firstName username avatar');

        // Send response
        Response(res, 200, true, message.postsFoundMessage, posts);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getPostById = async (req, res) => {
    try {
        // Parsin id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(id).populate('owner', 'firstName username avatar');

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Send response
        Response(res, 200, true, message.postFoundMessage, post);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getMyPosts = async (req, res) => {
    try {
        // Find posts
        const posts = await Post.find({ owner: req.user._id }).populate('owner', 'firstName username avatar');

        // Send response
        Response(res, 200, true, message.postsFoundMessage, posts);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getUserPosts = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find posts
        const posts = await Post.find({ owner: id }).populate('owner', 'firstName username avatar');

        // Send response
        Response(res, 200, true, message.postsFoundMessage, posts);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const deletePost = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(id);

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Check for owner
        if(post.owner.toString() !== req.user._id.toString()) {
            return Response(res, 401, false, message.unAuthorizedMessage);
        }

        // Delete image from cloudinary
        await cloudinary.v2.uploader.destroy(post.image.public_id);

        // Delete post from user's posts array
        let user = await User.findById(req.user._id);
        user.posts = user.posts.filter(postId => postId.toString() !== id);
        await user.save();

        // Delete post
        await Post.findByIdAndDelete(id);

        // Send response
        Response(res, 200, true, message.postDeletedMessage);
        
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}



export const addComment = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(id);

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Parsing body data
        const { comment } = req.body;

        // Checking the body data
        if(!comment) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Add comment
        const newComment = await Comment.create({
            comment,
            owner: req.user._id,
            post: post._id
        });

        // Set comment in post
        post.comments.push(newComment._id);
        await post.save();

        // Send response
        Response(res, 200, true, message.commentAddedMessage, newComment);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}