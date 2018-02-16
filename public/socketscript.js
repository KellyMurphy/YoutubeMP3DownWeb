  var socket = io();
  socket.on('news', function(data) {
      console.log(data);
      socket.emit('my other event', {
          my: 'data'
      });
  });

  socket.on('finished', function(data) {
      //console.log('finished');
      //console.log(data);
      q='"';
      $("#" + data.videoID).progressbar("destroy");
      $("#" + data.videoID + "_label").remove();
      //$("#" + data.videoID).append('<a href="' + data.link + '" + download>"' + data.VideoTitle + '</a>');
      //str = ["<a href=",data.link," + download",data.VideoTitle,"</a>"].join("");
      $("#" + data.videoID).append(["<a href=",q,data.link,q," download>",data.VideoTitle,"</a>"].join(""));

  });

  socket.on('progress', function(data) {
      //console.log('Progress:');
      //console.log(data);
      var progressbar = $("#" + data.videoID);
      var progressLabel = $("#" + data.videoID + "_label");
      //console.log(progressLabel);
      progressbar.progressbar({
          value: data.percentage
      });
      var progLabel = progressLabel.data('vidtitle'); // + progressbar.progressbar( "value" ) + "%";
      progressLabel.text(progLabel);
  });

  socket.on('starting', function(data) {
      //console.log('starting:');
      //console.log(data);
      $('#progresses').append('<div id=' + data.videoID + '></div>');
      var progressbar = $("#" + data.videoID);
      progressbar.progressbar({
          value: false
      });
      progressbar.append('<div class="progress-label" id=' + data.videoID + '_label>Loading...</div>');
      var progressLabel = $("#" + data.videoID + "_label");
      progressLabel.data('vidtitle', data.videoTitle);
      var pltop = progressbar.offset().top + 4;
      progressLabel.offset({
          top: pltop
      });

  });

  $(document).ready(function() {
      $('#wsdl').on('click', function() {

          request = {
              url: $('#url').val()
          };
          //console.log(request);
          $('#url').val('');
          socket.emit('download', request);
          return false;
      });
  });
