import Post from "../models/postModel.js";
import Reply from "../models/replyModel.js";
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




export const addComment = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Checking id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(id).populate('owner', 'username firstName avatar');

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Parsing body
        const { comment } = req.body;

        // Checking body
        if(!comment) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Create comment
        const newComment = await Comment.create({
            comment,
            owner: req.user._id,
            post: post._id
        })

        // Add comment in post's comments array
        post.comments.push(newComment._id);
        await post.save();

        // Send Response
        Response(res, 201, true, message.commentCreatedMessage, newComment);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getCommentById = async (req, res) => {
    try {
        // Parsing id
        const { commentId } = req.params;

        // Checking id
        if(!commentId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find comment
        const comment = await Comment.findById(commentId).populate('owner', 'username firstName avatar');

        // Check comment
        if(!comment) {
            return Response(res, 404, false, message.commentNotFoundMessage);
        }

        // Send Response
        Response(res, 200, true, message.commentFoundMessage, comment);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const addReply = async (req, res) => {
    try {
        // Parsing id
        const { commentId } = req.params;

        // Checking id
        if(!commentId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find comment
        const comment = await Comment.findById(commentId).populate('owner', 'username firstName avatar');

        // Check comment
        if(!comment) {
            return Response(res, 404, false, message.commentNotFoundMessage);
        }

        // Parsing body
        const { reply } = req.body;

        // Checking body
        if(!reply) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Create reply
        const newReply = await Reply.create({
            reply,
            owner: req.user._id,
            comment: comment._id
        })

        // Add reply in comment's replies array
        comment.replies.push(newReply._id);
        await comment.save();

        // Send Response
        Response(res, 201, true, message.replyCreatedMessage, newReply);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getReplyById = async (req, res) => {
    try {
        // Parsing id
        const { replyId } = req.params;

        // Checking id
        if(!replyId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find reply
        const reply = await Reply.findById(replyId).populate('owner', 'username firstName avatar');

        // Check reply
        if(!reply) {
            return Response(res, 404, false, message.replyNotFoundMessage);
        }

        // Send Response
        Response(res, 200, true, message.replyFoundMessage, reply);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getAllComments = async (req, res) => {
    try {
        // Parsing id
        const { postId } = req.params;

        // Checking id
        if(!postId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(postId);

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Fetch comments
        const comments = await Comment.find({ post: post._id })
            .populate({
                path: 'owner', 
                select: 'username firstName avatar'
            }).populate({
                path: 'replies',
                populate: {
                    path: 'owner', 
                    select: 'username firstName avatar'
                }
            });

        // Send Response
        Response(res, 200, true, message.commentsFoundMessage, comments);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}


export const getAllRepliesByComment = async (req, res) => {
    try {
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getAllRepliesByPost = async (req, res) => {
    try {
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}