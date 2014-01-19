function AnimeListCtrl($scope, $http){
  var url = '/json/anime';
  $scope.animeList = [];
    $http.get(url).success(function(data) {
      $scope.animeList = data.reverse();
      var animeTitlesTmp = {};
      $scope.animeTitles = [];
      data.forEach(function(item, index){
        if(!animeTitlesTmp[item.channel]){
          var channelName = item.title.split('　')[0];
          animeTitlesTmp[item.channel] = {name:channelName,selected:false};
          $scope.animeTitles.push({title: channelName, channel: item.channel,selected:false,btnclass:'btn-default'});
        }
      });
      var selectedCount = 0;
      $scope.dlshow = false;
      $scope.getSelectBtnClass = function(){return this.item.btnclass};
      $scope.getSelectDLBtnClass = function(){return ($scope.dlshow?'btn-success':'btn-default')};
      $scope.downloadSelectAction = function(){
        $scope.dlshow = !$scope.dlshow;
      }
      $scope.channelSelectAction = function(){
        this.item.selected = !this.item.selected;
        animeTitlesTmp[this.item.channel].selected = this.item.selected;
        this.item.btnclass = (this.item.selected ? 'btn-success':'btn-default' );
        if(this.item.selected){
          selectedCount++;
        }else{
          selectedCount--;
        }
      }
      var hasSelected = function(item){
        if(selectedCount > 0){
          if($scope.dlshow){
            return animeTitlesTmp[item.channel].selected && !!item.fileName;
          }else{
            return animeTitlesTmp[item.channel].selected;
          }
        }else{
          if($scope.dlshow){
            return !!item.fileName;
          }else{
            return true;
          }
        };
      }
      $scope.isShow = function(){
        return hasSelected(this.item);
      }
      $scope.downloadStatus = function(){
        return (this.item.fileName !== null ? "ダウンロード済みの動画を見る" : "ダウンロードする")
      };
      var download = function(){
          console.log(this.item.title);
          var videoid = this.item.id;
          var title = this.item.title;
          $.getJSON('/download/' + videoid,function(data){
            if(data.status){
              alert('「'+title+'」のダウンロードに成功しました');
              $scope.downloadStatus();
              $scope.downloadBtnAction = openVideo.bind(this);
            }else{
              alert('「'+title+'」のダウンロードに失敗しました');
            }
          })
      }
      $scope.downloadRequestById = function(){
        console.log($('#downloadRequestId').val());
        var videoid = $('#downloadRequestId').val();
        $.getJSON('/download/req/' + videoid,function(data){
          if(data.status){
            var title = data.title;
            alert('「'+title+'」のダウンロードに成功しました');
            location.reload();
          }else{
            alert('ダウンロードに失敗しました');
          }
        })
      }
      var openVideo = function(){location.href = '/view/' + this.item.id};
      $scope.downloadBtnAction = function(){
        (this.item.fileName == null ? download.bind(this) : openVideo.bind(this))();
      }
    });
}

