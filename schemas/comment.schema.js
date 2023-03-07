const mongoose = require("mongoose");
 
const commentsSchema = new mongoose.Schema({
  postId: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
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
  }
});

// module.exports = commentsSchema;

module.exports = mongoose.model("Comment", commentsSchema);

//postId: {
//    type: "string"
// },