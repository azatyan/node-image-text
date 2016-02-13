'use strict'
var http = require('http')
var fs = require('fs')
var Canvas = require('canvas')
var Url = require('url')

function divideTextIntoLines (text, wordperline, maxCharsPetLine) {
  var words = text.split(' ')
  var lines = []
  let k = ''
  let i = 0

  words.map((word, i) => {
    if (word.length > maxCharsPetLine) {
      let half = maxCharsPetLine - 2
      words.splice(i, 1,
        word.substring(0, half) + '-',
        word.substring(half)
      )
    }
  })

  words.map(word => {
    if ((k + word).length > maxCharsPetLine) {
      lines.push(k)
      k = ''
      i = 0
    }

    k += word + ' '
    i++
    if (i > 0 && i % wordperline === 0) {
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

function createImage (background, text, cb) {
  var wordperline = 5
  var maxCharsPetLine = 30
  var fontSize = 30

  fs.readFile(background, function (err, squid) {
    if (err) {
      console.log(err)
      return null
    }

    var img = new Canvas.Image()
    img.src = squid
    var canvas = new Canvas(img.width, img.height)
    var ctx = canvas.getContext('2d')
    ctx.font = '' + fontSize + 'px Open Sans'
    ctx.drawImage(img, 0, 0, img.width, img.height)
    ctx.stroke()
    ctx.fillStyle = '#1da1f2';

    var texts = divideTextIntoLines(text, wordperline, maxCharsPetLine)
    texts.map((text, i) => {
      let left = Math.max(0, parseInt((img.width - text.length * (fontSize - 15)) / 2, 10))
      ctx.fillText(text, left, 140 + (i * 40))
    })

    ctx.stroke()
    return cb(canvas.toBuffer())
  })
}

http.createServer(function (request, response) {
  var textMaxLength = 200
  var text = Url.parse(request.url, true).query.text
  if (!text || text === '') {
    response.end('No Text')
  } else {
    text = text.substring(0, textMaxLength)
    console.log('Text: ' + text)
    var background = __dirname + '/image.png'
    createImage(background, text, function (buf) {
      response.setHeader('Content-Type', 'image/png')
      response.end(buf)
    })
  }
}).listen(8000)
