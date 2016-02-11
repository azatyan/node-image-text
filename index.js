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

function getText(textParam){
    var text = textParam || 'Text not defined';
    text = text.split(' ');
    var tempArray = [];
    var texts = [];
    for (var i = 0; i < text.length; i++) {
        tempArray.push(text[i]);
        if (i > 0 && (i % wordperline === 0 || i + 1 === text.length)) {
            texts.push(tempArray.join(' '));
            tempArray = []
        }
    };
    return texts;
}

function createImage(request, response){
    fs.readFile(bg, function (err, squid) {
        var img = new Image();
        img.src = squid;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.stroke();
        var texts = getText(Url.parse(request.url, true).query.text);
        for (var i = 0; i < texts.length; i++) {
            ctx.fillText(texts[i], 80, 130 + (i * 40))
        }
        ctx.stroke();
        response.end(canvas.toBuffer());
    })
}
http.createServer(function (request, response) {
    createImage(request,response);
}).listen(8000);