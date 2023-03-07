const mongoose = require("mongoose");
// const commentsSchema = require('./comment.schema.js');
// const {Schema} = mongoose;
// const {Types:{ObjectId}} = Schema;
 
const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  // password: {
  //   type: Number,
  // },
  title: {
    type: String,
  },
  content: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // comments: [commentsSchema]
});

module.exports = mongoose.model("Post", postSchema);