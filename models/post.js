const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
      type: String
  },
  slug: {
      type: String
  },
  description: {
    type: String
  },
  createdDate: {
      type: Date,
      default: Date.now
  }  
})

module.exports = mongoose.model('posts', postSchema);