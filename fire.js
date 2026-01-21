
var canvas = document.getElementById("trails-canvas");
var ctx = canvas.getContext("2d");

window.onload = function() {
	initAnimate();
};

document.getElementById("iframMusic").onload = function(){
    var music = document.getElementById("music");
    music.src = 'music/dream.mp3';
    music.oncanplay = function(){
        music.play();
    };
};

function initAnimate() {
    drawBg();
    animate()
}

function animate() {
    ctx.save();
    ctx.fillStyle = "rgba(0,5,24,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    stars.foreach(function() {
        this.paint()
    });
    
    drawMoon();
    
    raf(animate)
}
function drawMoon() {
    var moon = document.getElementById("moon");
    var centerX = canvas.width - 200,
        centerY = 100,
        width = 80;
    if (moon.complete) {
        ctx.drawImage(moon, centerX, centerY, width, width)
    } else {
        moon.onload = function() {
            ctx.drawImage(moon, centerX, centerY, width, width)
        }
    }
    //月亮发光
    var index = 20;
    for (var i = 0; i < 10; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX + width / 2, centerY + width / 2, width / 2 + index, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(240,219,120,0.005)";
        index += 2;
        ctx.fill();
        ctx.restore()
    }
}

Array.prototype.foreach = function(callback) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] !== null) {
            callback.apply(this[i], [i])
        }
    }
};

var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60)
    };
    
canvas.onclick = function() {
    var x = event.clientX;
    var y = event.clientY;
    createFireworks(x,y);
    var bigboom = new Boom(getRandom(canvas.width / 3, canvas.width * 2 / 3), 2, "#FFF", {
        x: x,
        y: y
    });
    bigbooms.push(bigboom)
};

var Boom = function(x, r, c, boomArea, shape) {
    this.booms = [];
    this.x = x;
    this.y = (canvas.height + r);
    this.r = r;
    this.c = c;
    this.shape = shape || false;
    this.boomArea = boomArea;
    this.theta = 0;
    this.dead = false;
    this.ba = parseInt(getRandom(80, 200))
};
Boom.prototype = {
    _paint: function() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.c;
        ctx.fill();
        ctx.restore()
    },
    _move: function() {
        var dx = this.boomArea.x - this.x,
            dy = this.boomArea.y - this.y;
        this.x = this.x + dx * 0.01;
        this.y = this.y + dy * 0.01;
        if (Math.abs(dx) <= this.ba && Math.abs(dy) <= this.ba) {
            if (this.shape) {
                this._shapBoom()
            } else {
                this._boom()
            }
            this.dead = true
        } else {
            this._paint()
        }
    },
    _drawLight: function() {
        ctx.save();
        ctx.fillStyle = "rgba(255,228,150,0.3)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r + 3 * Math.random() + 1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore()
    },
    _boom: function() {
        var fragNum = getRandom(30, 200);
        var style = getRandom(0, 10) >= 5 ? 1 : 2;
        var color;
        if (style === 1) {
            color = {
                a: parseInt(getRandom(128, 255)),
                b: parseInt(getRandom(128, 255)),
                c: parseInt(getRandom(128, 255))
            }
        }
        var fanwei = parseInt(getRandom(300, 400));
        for (var i = 0; i < fragNum; i++) {
            if (style === 2) {
                color = {
                    a: parseInt(getRandom(128, 255)),
                    b: parseInt(getRandom(128, 255)),
                    c: parseInt(getRandom(128, 255))
                }
            }
            var a = getRandom( - Math.PI, Math.PI);
            var x = getRandom(0, fanwei) * Math.cos(a) + this.x;
            var y = getRandom(0, fanwei) * Math.sin(a) + this.y;
            var radius = getRandom(0, 2);
            var frag = new Frag(this.x, this.y, radius, color, x, y);
            this.booms.push(frag)
        }
    },
    _shapBoom: function() {
        var that = this;
        putValue(ocas, octx, this.shape, 5,
            function(dots) {
                var dx = canvas.width / 2 - that.x;
                var dy = canvas.height / 2 - that.y;
                for (var i = 0; i < dots.length; i++) {
                    color = {
                        a: dots[i].a,
                        b: dots[i].b,
                        c: dots[i].c
                    };
                    var x = dots[i].x;
                    var y = dots[i].y;
                    var radius = 1;
                    var frag = new Frag(that.x, that.y, radius, color, x - dx, y - dy);
                    that.booms.push(frag)
                }
            })
    }
};

function putValue(canvas, context, ele, dr, callback) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var img = new Image();
    if (ele.innerHTML.indexOf("img") >= 0) {
        img.src = ele.getElementsByTagName("img")[0].src;
        imgload(img,
            function() {
                context.drawImage(img, canvas.width / 2 - img.width / 2, canvas.height / 2 - img.width / 2);
                dots = getimgData(canvas, context, dr);
                callback(dots)
            })
    } else {
        var text = ele.innerHTML;
        context.save();
        var fontSize = 200;
        context.font = fontSize + "px 宋体 bold";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "rgba(" + parseInt(getRandom(128, 255)) + "," + parseInt(getRandom(128, 255)) + "," + parseInt(getRandom(128, 255)) + " , 1)";
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        context.restore();
        dots = getimgData(canvas, context, dr);
        callback(dots)
    }
}
function imgload(img, callback) {
    if (img.complete) {
        callback.call(img)
    } else {
        img.onload = function() {
            callback.call(this)
        }
    }
}
function getimgData(canvas, context, dr) {
    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height);
    var dots = [];
    for (var x = 0; x < imgData.width; x += dr) {
        for (var y = 0; y < imgData.height; y += dr) {
            var i = (y * imgData.width + x) * 4;
            if (imgData.data[i + 3] > 128) {
                var dot = {
                    x: x,
                    y: y,
                    a: imgData.data[i],
                    b: imgData.data[i + 1],
                    c: imgData.data[i + 2]
                };
                dots.push(dot)
            }
        }
    }
    return dots
}
function getRandom(a, b) {
    return Math.random() * (b - a) + a
}

var maxRadius = 1,
    stars = [];
function drawBg() {
    for (var i = 0; i < 500; i++) {
        var r = Math.random() * maxRadius;
        var x = Math.random() * canvas.width;
        var y = Math.random() * 2 * canvas.height - canvas.height;
        var star = new MyStar(x, y, r);
        stars.push(star);
        star.paint()
    }
}
var MyStar = function(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r
};

MyStar.prototype = {
    paint: function() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,255,255," + this.r + ")";
        ctx.fill();
        ctx.restore()
    }
};

var focallength = 250;
var Frag = function(centerX, centerY, radius, color, tx, ty) {
    this.tx = tx;
    this.ty = ty;
    this.x = centerX;
    this.y = centerY;
    this.dead = false;
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.color = color
};
Frag.prototype = {
    paint: function() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(" + this.color.a + "," + this.color.b + "," + this.color.c + ",1)";
        ctx.fill();
        ctx.restore()
    },
    moveTo: function(index) {
        this.ty = this.ty + 0.3;
        var dx = this.tx - this.x,
            dy = this.ty - this.y;
        this.x = Math.abs(dx) < 0.1 ? this.tx: (this.x + dx * 0.1);
        this.y = Math.abs(dy) < 0.1 ? this.ty: (this.y + dy * 0.1);
        if (dx === 0 && Math.abs(dy) <= 80) {
            this.dead = true
        }
        this.paint()
    }
};

javascript:
!(function () {
	
	var textCanvas = document.createElement("canvas");
	textCanvas.width = 1024;
	textCanvas.height = 748;
	var textctx = textCanvas.getContext("2d");
	textctx.fillStyle = "#000000";
	textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

	var canvas = document.getElementById("mycanvas");

	var context = canvas.getContext("2d");
	
	function resizeCanvas() {
		canvas.width =textCanvas.width= window.innerWidth*1.5;
		canvas.height =textCanvas.height = window.innerHeight*1.5;
		clearCanvas();
	}

	function clearCanvas() {
		context.fillStyle = "#000000";
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

	resizeCanvas();

	window.addEventListener("resize", resizeCanvas);

	mytext = ['大傻春','州官','嘴嗨姐','成功上岸','美丽迷人', '三宝', '我爱你', '一生一世', '吃不胖', '平安喜乐', '美丽大方', '快快乐乐', '心想事成', '万事顺意', '一辈子在一起', '好运连连'];

	function mouseDownHandler(e) {
		resizeCanvas();
		var x = e.clientX;
		var y = e.clientY;
//		debugger
		let nowTime = new Date();//获取当前时间
		let setTime = new Date('2023/1/1');//设置结束时间
		let remianAllSeconds = Math.floor((setTime.getTime() - nowTime.getTime()) / 1000);//剩余总秒数
		if (remianAllSeconds >= 0) {
			createFireworks(x, y);
		}
		else {
			createFireworks(x, y,mytext[Math.floor(Math.random() * 12)]);
		}
	}
	document.addEventListener("mousedown", mouseDownHandler);

	var particles = [];

	function createFireworks(x, y, text = "") {
		var hue = Math.random() * 360;
		var hueVariance = 30;

		function setupColors(p) {
			p.hue = Math.floor(Math.random() * ((hue + hueVariance) - (hue - hueVariance))) + (hue - hueVariance);
			p.brightness = Math.floor(Math.random() * 21) + 50;
			p.alpha = (Math.floor(Math.random() * 61) + 40) / 100;
		}

        if (text != "") {

            // Render the text at a larger internal font, sample densely, then scale down
            var gap = 3; // tighter sampling for Chinese glyph detail
            var renderFont = Math.max(80, Math.floor(canvas.width / 10));
            var displayFont = Math.max(18, Math.floor(canvas.width / 80));
            var scale = displayFont / renderFont;

            textctx.font = renderFont + "px \"Microsoft YaHei\", \"SimSun\", 宋体, Arial, sans-serif";
            textctx.fillStyle = "#ffffff";

            var textWidth = Math.ceil(textctx.measureText(text).width);
            var textHeight = Math.ceil(renderFont);

            // Draw text into the offscreen canvas
            textctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
            textctx.fillText(text, 0, textHeight);
            var imgData = textctx.getImageData(0, 0, textWidth, Math.ceil(textHeight * 1.2));

            // clear for next use
            textctx.fillStyle = "#000000";
            textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

            for (var h = 0; h < textHeight * 1.2; h += gap) {
                for (var w = 0; w < textWidth; w += gap) {
                    var position = (Math.floor(imgData.width) * Math.floor(h) + Math.floor(w)) * 4;
                    var r = imgData.data[position], g = imgData.data[position + 1], b = imgData.data[position + 2], a = imgData.data[position + 3];

                    if (!a || (r + g + b) === 0) continue;

                    var p = {};

                    p.x = x;
                    p.y = y;

                    // scale down the target positions so final text appears smaller but preserves detail
                    p.fx = x + (w - textWidth / 2) * scale;
                    p.fy = y + (h - textHeight / 2) * scale;

                    // small particle size to keep characters crisp
                    p.size = Math.floor(Math.random() * 1) + 1;
                    p.speed = 1;
                    setupColors(p);

                    particles.push(p);
                }
            }
        } else {
			var count = 100;
			for (var i = 0; i < count; i++) {
				//角度
				var angle = 360 / count * i;
				//弧度
				var radians = angle * Math.PI / 180;

				var p = {};

				p.x = x;
				p.y = y;
				p.radians = radians;

				//大小
				p.size = Math.random()*2+1;

				//速度
				p.speed = Math.random()*5+.4;

				//半径
				p.radius = Math.random()*81+50;

				p.fx = x + Math.cos(radians) * p.radius;
				p.fy = y + Math.sin(radians) * p.radius;

				setupColors(p);

				particles.push(p);
			}
		}
	}
	function drawFireworks() {
		clearCanvas();

		for (var i = 0; i < particles.length; i++) {
			var p = particles[i];

			p.x += (p.fx - p.x) / 4;
			p.y += (p.fy - p.y) / 4 - (p.alpha - 1) * p.speed;
			
		
			p.alpha -= 0.01;

			if (p.alpha <= 0) {
				particles.splice(i, 1);
				continue;
			}

			context.beginPath();
			context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
			context.closePath();

			context.fillStyle = 'hsla(' + p.hue + ',100%,' + p.brightness + '%,' + p.alpha + ')';
			context.fill();
		}
	}

	//requestAnimationFrame
	var lastStamp = 0;
	function tick(opt = 0) {

		if (opt - lastStamp > 1000) {
			lastStamp = opt;
			var str = showTime();
			if (str !== undefined) {
				createFireworks(893, 333, showTime());
            }
			
		}
		context.globalCompositeOperation = 'destination-out';
		context.fillStyle = 'rgba(0,0,0,' + 10 / 100 + ')';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.globalCompositeOperation = 'lighter';

		drawFireworks();

		requestAnimationFrame(tick);
	}
	tick();
	function showTime() {
		let nowTime = new Date();//获取当前时间
		let setTime = new Date('2023/1/1');//设置结束时间
		let str;
		let remianAllSeconds = Math.floor((setTime.getTime() - nowTime.getTime()) / 1000);//剩余总秒数
		if (remianAllSeconds >= 0) {
			str = toChinesNum(remianAllSeconds);
		}
		else if (remianAllSeconds >= -5 && remianAllSeconds < 0) {
			str = "新年快乐";
		}
		
		return str;
	}
	function toChinesNum(num) {
		let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
		let unit = ['', '十', '百', '千', '万']
		num = parseInt(num)
		let getWan = (temp) => {
			let strArr = temp.toString().split('').reverse()
			let newNum = ''
			let newArr = []
			strArr.forEach((item, index) => {
				newArr.unshift(item === '0' ? changeNum[item] : changeNum[item] + unit[index])
			})
			let numArr = []
			newArr.forEach((m, n) => {
				if (m !== '零') numArr.push(n)
			})
			if (newArr.length > 1) {
				newArr.forEach((m, n) => {
					if (newArr[newArr.length - 1] === '零') {
						if (n <= numArr[numArr.length - 1]) {
							newNum += m
						}
					} else {
						newNum += m
					}
				})
			} else {
				newNum = newArr[0]
			}

			return newNum
		}
		let overWan = Math.floor(num / 10000)
		let noWan = num % 10000
		if (noWan.toString().length < 4) {
			noWan = '0' + noWan
		}
		return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
	}
})();