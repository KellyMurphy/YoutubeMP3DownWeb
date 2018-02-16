var express = require('express');
var path = require('path');
var app = express();
var ytdl = require('ytdl-core');
var YoutubeMp3Downloader = require('youtube-mp3-downloader');
var url = require('url');
var qs = require('querystring');
var server = require('http').createServer(app);
var socket = require('socket.io')(server);

//Configure YoutubeMp3Downloader
var YDI = {
    "ffmpegPath": __dirname + '\\ffmpeg\\bin\\ffmpeg.exe', // Where is the FFmpeg binary located?
    "outputPath": __dirname + '\\download', // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest", // What video quality should be used?
    "queueParallelism": 4, // How many parallel downloads/encodes should be started?
    "progressTimeout": 100 // How long should be the interval of the progress reports
};

socket.on('connection', function(socket) {
    //console.log(socket);
    socket.emit('news', {
        hello: 'World'
    });
    socket.on('my other event', function(data) {
        console.log(data);
    });
    socket.on('download', function(data) {
        console.log(data);
        var vid = url.parse(data.url, true);
        console.log(vid);
        console.log('Socket Dowinloading video: \'' + vid.query.v + '\'');

        ytdl.getInfo("http://www.youtube.com/watch?v=" + vid.query.v, function(err, info) {

            if (err) {
                console.log(err);
            } else {
                var results = {
                    videoID: vid.query.v,
                    videoTitle: info.title
                };

                console.log("======================================================================");
                console.log("Starting Results:");
                console.log(results);

                socket.emit('starting', results);
                socket.broadcast.emit('starting', results);
            }
        });



        var YD = new YoutubeMp3Downloader(YDI);

        YD.on("finished", function(err, data) {
            var str = data.file;
            var pos = str.search("download/");

            var results = {
                videoID: data.videoId,
                VideoTitle: data.videoTitle,
                link: str.slice(pos, str.length)
            };
            console.log("======================================================================");
            console.log("Finished Results:");
            console.log(results);
            socket.emit('finished', results);
            socket.broadcast.emit('finished', results);
        });

        YD.on("error", function(error) {
            console.log('Error: ');
            console.log(error);

        });

        YD.on("progress", function(progress) {
            results = {
                videoID: progress.videoId,
                percentage: Math.round(progress.progress.percentage)
            };
            socket.emit('progress', results);
            socket.broadcast.emit('progress', results);
        });

        var vid = url.parse(vid, true);


        console.log('just before dl');
        YD.download(vid.query.v);
    });
});




//====================================================
//
// Express Static Routes
//
//====================================================
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/lib')));
app.use('/bc', express.static(path.join(__dirname, '/bower_components')));
app.use('/download', express.static(path.join(__dirname, '/download')));

app.set('view engine', 'pug');

//app.get('/', YTModule.YTModule(req, res));


app.get('/', function(req, res) {

    if (!req.query.url) {
        res.render('index', {});
        return;
    }
});
server.listen(3000);
console.log('listening on 3000');
