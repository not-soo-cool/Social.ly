import mongoose from "mongoose";

const replySchema = mongoose.Schema({
    reply: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Soc'
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User_Soc'
        }
    ]
}, { 
    timestamps: true 
});

const Reply = mongoose.model('Reply', replySchema);
export default Reply