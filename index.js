'use strict'
var http = require('http')
var fs = require('fs')
var Canvas = require('canvas')
var Url = require('url')

function divideTextIntoLines (text, wordPerLine, maxCharsPerLine) {
  text = text.split(',').join(', ').split('.').join('. ');
  var words = text.split(' ')
  var lines = []
  let k = ''
  let i = 0

  words.map((word, i) => {
    if (word.length > maxCharsPerLine) {
      let half = maxCharsPerLine - 2
      words.splice(i, 1,
        word.substring(0, half) + '-',
        word.substring(half)
      )
    }
  })

  words.map(word => {
    if ((k + word).length > maxCharsPerLine) {
      lines.push(k)
      k = ''
      i = 0
    }

    k += word + ' '
    i++
    if (i > 0 && i % wordPerLine === 0) {
      lines.push(k)
      k = ''
      i = 0
    }
  })

  if (k !== '') {
    lines.push(k)
  }
  return lines
}

function createImage (background, text, color, cb) {
  var wordPerLine = 5
  var maxCharsPetLine = 50
  var fontSize = 26

  fs.readFile(background, function (err, squid) {
    var img = new Canvas.Image()
    img.src = squid
    var canvas = new Canvas(img.width, img.height)
    var ctx = canvas.getContext('2d')
    ctx.font = '' + fontSize + 'px Open Sans'
    ctx.drawImage(img, 0, 0, img.width, img.height)
    ctx.stroke()
    ctx.fillStyle = color;

    var texts = divideTextIntoLines(text, wordPerLine, maxCharsPetLine)
    texts.map((text, i) => {
      ctx.fillText(text, 100, 60 + (i * 40))
    })

    ctx.stroke()
    return cb(canvas.toBuffer())
  })
}

http.createServer(function (request, response) {
  var text = Url.parse(request.url, true).query.text
  var image = parseInt(Url.parse(request.url, true).query.image) || 1
  if (!text || text === '' || image > 8 || image < 1) {
    fs.readFile(__dirname+'/views/index.html', function (err, html) {
      response.setHeader('Content-Type', 'text/html');
      response.end(html)
    });
  } else {
      var textMaxLength = 200;
      text = text.substring(0, textMaxLength)
      var background = __dirname + '/static/bg/'+image+'.jpg'
      var color = Url.parse(request.url,true).query.color;
      if(!color || color == '') {
          color = "#ffffff";
      } else {
          color = "#"+color;
      };
      createImage(background, text, color, function (buf) {
          response.setHeader('Content-Type', 'image/png')
          response.end(buf)
      })
  }
}).listen(8000)