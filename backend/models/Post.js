import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: 'PlutoBoost Team',
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

export default Post;