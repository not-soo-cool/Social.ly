import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { addComment, addReply, getAllComments, getAllRepliesByComment, getAllRepliesByPost, getCommentById, getReplyById } from "../controllers/postController";

const commentRouter = express.Router();

commentRouter.post("/add/:id", isAuthenticated, addComment);

commentRouter.get("/:postId", isAuthenticated, getCommentById);

commentRouter.post("/add/reply/:commentId", isAuthenticated, addReply);

commentRouter.get("/reply/:replyId", isAuthenticated, getReplyById);

commentRouter.get("/all/:postId", isAuthenticated, getAllComments);

commentRouter.get("/replies/post/:postId", isAuthenticated, getAllRepliesByPost);

commentRouter.get("/replies/comment/:commentId", isAuthenticated, getAllRepliesByComment);

export default commentRouter;