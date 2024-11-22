import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { Response } from "../utils/response.js"
import cloudinary from 'cloudinary'

export const createPost = async (req, res) => {
    try {
        // Parsing body data
        const { image, caption, location, mentions } = req.body

        // Check body data
        if(!caption){
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        if(!image){
            return Response(res, 400, false, message.imageMissingMessage);
        }

        // Upload image
        const imageResult = await cloudinary.v2.uploader.upload(image, {
            folder: 'posts',
        })

        // Create post
        const post = await Post.create({
            image: {
                public_id: imageResult.public_id,
                url: imageResult.secure_url,
            },
            caption,
            location,
            mentions,
            owner: req.user._id,
        })

        // Add post in user's posts array
        const user = await User.findById(req.user._id);
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
        // Get all posts
        const posts = await Post.find().populate('owner', 'username firstName avatar');

        // Check posts
        if(posts.length === 0) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Send Response
        Response(res, 200, true, message.postsFoundMessage, posts);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getPostById = async (req, res) => {
    try {
        // Parsing params
        const { id } = req.params;

        // Find post
        const post = await Post.findById(id).populate('owner', 'username firstName avatar');

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Send Response
        Response(res, 200, true, message.postFoundMessage, post);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getMyPosts = async (req, res) => {
    try {
        // Get my posts
        const posts = await Post.find({ owner: req.user._id }).populate('owner', 'username firstName avatar');

        // Check posts
        if(posts.length === 0) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Send Response
        Response(res, 200, true, message.postsFoundMessage, posts);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}