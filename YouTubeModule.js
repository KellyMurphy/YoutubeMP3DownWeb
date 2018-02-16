function YTModule (req, res)  {

	if (!req.query.url) {
		res.render('index', {});
		return;
    }
    var vid = url.parse(req.query.url, true);

    console.log('Dowinloading video: \''+ vid.query.v + '\'' );
    var YD = new YoutubeMp3Downloader(YDI);
    YD.on("finished", function(err, data) {
        console.log('finished:');
        console.log(data);
        var str = data.file;
    	var pos = str.search("download/");

        var results= {
        	    VideoTitle: data.videoTitle,
        		link: str.slice(pos,str.length)
        };
        console.log(results);
        res.render('index', results);
    });

    YD.on("error", function(error) {
    	console.log('Error: ');
        console.log(error);
        res.render('index', {});
    });

    YD.on("progress", function(progress) {
        console.log(progress);
    });

    var vid = url.parse(vid, true);

    
    console.log('just before dl');
    YD.download(vid.query.v);
 
}

module.exports.YTModule; YTModule;