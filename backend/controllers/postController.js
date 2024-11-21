import Post from "../models/postModel.js";
import { Response } from "../utils/response.js"
import cloudinary from "cloudinary";
import { message } from "../utils/message.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {
    try {
        // Parsing body data
        const { image, caption, location } = req.body;

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
            location
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