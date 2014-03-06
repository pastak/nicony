var Video = require('./videoModel').Video;
var request = require('request');
var cheerio = require('cheerio');

exports.JSON = function(req, res){
  res.contentType('application/json');
  request(
    {
    uri: "http://ch.nicovideo.jp/portal/anime",
  }, 
  function(error, response, body) {
    if(error){
      body = undefined;
    }
      updateAnimeList(body,res);
  })
}

exports.channels = function(){
  res.contentType('application/json');
  Video.find({},function(err,items){
    if(err){
      console.log(err)
    }else{
      var channels = [];
      items.forEach(function(index, item){
        channels.push({
          id: item.channel,
          name: title.split('　')[0]
        });
      })
      var json = JSON.stringify(channels);
      res.send(json);
    }
  })
}

function updateAnimeList(body,res){
  if(body){
    var $ = cheerio.load(body);
    $("#playerNav0 > ul > li").each(function() { 
      var list = $(this);
      var title = list.find('input[name=title]').val();
      var channel_id = list.find('input[name=channel_id]').val();
      var thumbnail = list.find('input[name=thumbnail_url]').val();
      var video_id = list.attr('id').replace(/video_\d+_/,'');
      Video.find({id:video_id},function(err,items){
        if(items.length < 1){
          var newvideo = new Video();
          newvideo.title = title;
          newvideo.id = video_id;
          newvideo.thumbnail = thumbnail;
          newvideo.channel = channel_id;
          newvideo.fileName = null;
          newvideo.save(function(err){if(err)console.log(err)});
        }
      });
    });
  }
  Video.find({},function(err,items){
    if(err){
      console.log(err)
    }else{
      var json = JSON.stringify(items);
      res.send(json);
    }
  });
}
