const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title:{
        type:String,
        required: true,
    },
    content:{
        type:String,
        required: true,
    },
    tags:{
        type:[String],
    },
    date:{
        type:Date,
        default: Date.now,
    },
})


const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
