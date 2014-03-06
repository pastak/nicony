var exec = require('child_process').exec
  , Video = require('./videoModel').Video
  , request = require('request')
  , cheerio = require('cheerio');
//var videoId = '1389346996';
exports.index = function(req,res){
var videoId = req.params.id;
exec('php ./download.php ' + videoId + ' > ./videos/' + videoId + '.mp4', function(err, stdout, stderr){
    if(err){
      console.log(err);
      res.json({status:0});
    }else{
      Video.update({id:videoId}, {$set:{fileName: videoId + '.mp4'}}, function(err){ console.log(err) });
      res.json({status:1});
      req.query.title && console.log('「' + req.query.title + '」をダウンロードに成功しました');
    }
});

}

exports.request = function(req,res){
 var videoId = req.params.id;
exec('php ./download.php ' + videoId + ' > ./videos/' + videoId + '.mp4', function(err, stdout, stderr){
    if(err){
      console.log(err);
      res.json({status:0});
    }else{
      request({
        uri: "http://ext.nicovideo.jp/api/getthumbinfo/" + videoId
      },function(error, res, body){
        if(error){
            console.log(error);
            res.json({status:0});
            return false;
          }
        var $ = cheerio.load(body);
        var thumb = $("thumb");
        var newvideo = new Video();
        var title = thumb.find('title').text();
        newvideo.title = title;
        newvideo.id = videoId;
        newvideo.thumbnail = thumb.find('thumbnail_url').text();
        newvideo.channel = 'ch' + thumb.find('ch_id').text();
        newvideo.fileName = videoId + '.mp4';
        newvideo.save(function(err){
          if(err){
            console.log(err);
            res.json({status:0});
            return false;
          }else{
            console.log('「'+title+'」のダウンロードに成功しました');
            res.json({
              status: 1,
              title: title
            });
          }
        });
      });
    }
});

 
}
