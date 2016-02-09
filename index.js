'use strict';
var http = require('http');
var fs = require('fs');
var Canvas = require('canvas');
var Url = require('url');
var readableStream = require('readable-stream');

var Image = Canvas.Image;

var canvas = new Canvas(600, 400);
var ctx = canvas.getContext('2d');
var fontsize = '20';
var wordperline = 6;
var image = __dirname + '/images/image.png';


/**
 * @param response
 * @param file_path
 */
function serveImage(response, file_path){
    fs.createReadStream(file_path).pipe(response)
}


/**
 * @param request
 * @returns {Array}
 */
function getText(request){
    var text = Url.parse(request.url, true).query.text;
    if(typeof text == 'undefined'){
        text = 'Text not defined'
    };

    text = text.split(' ');

    var temp_array = [];
    var texts = [];
    for (var i = 0; i < text.length; i++) {
        temp_array.push(text[i]);
        if (i > 0 && (i % wordperline === 0 || i + 1 === text.length)) {
            texts.push(temp_array.join(' '));
            temp_array = []
        }
    };

    return texts;
}

var server = http.createServer(function (request, response) {

    var text = getText(request);
    var name = Math.floor(Math.random() * 60000000) + 1000000;
    name = 'public/' + name + '.png';

    fs.readFile(image, function (err, squid) {
        if (err) throw err;
        var img = new Image();
        img.src = squid;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.stroke();
        ctx.font = fontsize + 'px Open Sans';
        ctx.fillStyle = 'rgb(16,176,230)';
        var texts = getText(request);
        for (var i = 0; i < texts.length; i++) {
            ctx.fillText(texts[i], 80, 130 + (i * 40))
        }
        ctx.stroke();

        var out = fs.createWriteStream(name);
        var stream = canvas.pngStream();

        stream.on('data', function (chunk) {
            out.write(chunk)
        });

        stream.on('end', function () {
            serveImage(response, name)
        })
    })
});
server.listen(8000);
