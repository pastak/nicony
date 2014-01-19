var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/test');

var Video = new mongoose.Schema({
  title: String,
  id: Number,
  thumbnail: String,
  channel: String,
  fileName: String
});

exports.Video = db.model('Video', Video);


