import express from "express";
import { createPost, deletePost, getAllPosts, getMyPosts, getPostById, getUserPosts } from "../controllers/postController.js";
import { isAuthenticated } from "../middleware/auth.js";

const postRouter = express.Router();

postRouter.post("/create", isAuthenticated, createPost);

postRouter.get("/all", isAuthenticated, getAllPosts);

postRouter.get("/my", isAuthenticated, getMyPosts);

postRouter.get("/user", isAuthenticated, getUserPosts);

postRouter.route("/:id", isAuthenticated)
    .get(getPostById)
    .delete(deletePost);

export default postRouter;