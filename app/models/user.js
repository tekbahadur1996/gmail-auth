var mongoose = require('mongoose');

var Post = mongoose.model('Post', {
  text: {
    type: String,
    trim: true
  },
  name: {
    type: String,
  },
  comment : [{
    commentName: {
      type: String
    },
    commentData: {
      type: String
    }
  }]
});

module.exports = {Post};
