'use strict';
var http = require('http');
var fs = require('fs');
var Canvas = require('canvas');
var Url = require('url');
var Image = Canvas.Image;
var bg = __dirname + '/images/image.png';
var wordperline = 6;
var canvas = new Canvas(600, 400);
var ctx = canvas.getContext('2d');
    ctx.fileStyle = 'rgb(16,176,230)';
    ctx.font = '20px Open Sans';

/**
 * @param request
 * @returns {Array}
 */
function getText(text){
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

function createImage(name, request, response){
    fs.readFile(bg, function (err, squid) {
        if (err) throw err;
        var img = new Image();
        img.src = squid;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.stroke();
        var texts = getText(Url.parse(request.url, true).query.text);
        for (var i = 0; i < texts.length; i++) {
            ctx.fillText(texts[i], 80, 130 + (i * 40))
        }
        ctx.stroke();

        var out = fs.createWriteStream(name);

        canvas.pngStream().on('data', function (chunk) {
            out.write(chunk)
        }).on('end', function () {
            fs.createReadStream(name).pipe(response);
        })
    })
}

http.createServer(function (request, response) {
    var name = 'public/' + Math.floor(Math.random() * 60000000) + '.png';
    createImage(name,request,response);
}).listen(8000);
