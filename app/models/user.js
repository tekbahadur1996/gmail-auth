var mongoose = require('mongoose');

var Post = mongoose.model('Post', {
  text: {
    type: String,
    trim: true
  },
  name: {
    type: String,
  }
});

module.exports = {Post};
