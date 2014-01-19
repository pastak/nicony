var Video = require('../videoModel').Video;

exports.index = function(req, res){
  res.render('index', { 
      title: 'ニコニコアニメチャンネルビューワー',
  });
};

exports.view = function(req, res){
  Video.findOne({id:req.params.id},function(err,item){
    console.log(item);
    res.render('view', {
      id: item.id,
      title: 'ニコニコアニメチャンネルビューワー',
      videotitle: item.title
    });
  })
}
