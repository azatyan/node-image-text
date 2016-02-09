var http = require("http");
var canvas = require("canvas");
var fs = require('fs');

var Canvas = require('canvas')
  , Image = Canvas.Image
  , canvas = new Canvas(600, 400)
  , ctx = canvas.getContext('2d');


  	var fontsize = "20";
  	var wordperline = 6;
  	var image = __dirname + '/images/image.png';
	var text = "node-canvas extends the canvas API to provide interfacing with node, for example streaming PNG data, converting to a Buffer instance, etc. A";
	var name = Math.floor(Math.random() * 60000000) + 1000000;
	name = 'public/'+name +".png";


	fs.readFile(image, function(err, squid){
	  if (err) throw err;
	  img = new Image;
	  img.src = squid;
	  ctx.drawImage(img, 0, 0, img.width, img.height);
	  ctx.stroke();

	text = text.split(" ");
	var temparray = [];
	var texts = [];
	for(var i = 0;i< text.length;i++){
		temparray.push(text[i]);
		if(i>0  && (i % wordperline === 0 || i+1 === text.length)){
			texts.push(temparray.join(" "));
			temparray = [];
		}
	};

	ctx.font = fontsize+'px Open Sans';
	ctx.strokeStyle = 'rgba(240, 240, 240, 1)';

	for(var i = 0; i < texts.length; i++){
		ctx.fillText(texts[i], 80, 130+(i*40));
	};
	ctx.stroke();

	var out = fs.createWriteStream(name)
	  , stream = canvas.pngStream();
	stream.on('data', function(chunk){
	  out.write(chunk);
	});

	stream.on('end', function(){
	  console.log('saved png');
	});
		});