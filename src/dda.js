// Initialize
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var width = 800;
var height = 600;

var bgRgba = [240, 240, 200, 255];
var pointRgba = [0, 0, 255, 255]; 
var lineRgba = [0, 0, 0, 255]; 
var vlineRgba = [255, 0, 0, 255];

canvas.setAttribute("width", width); 
canvas.setAttribute("height", height);

// Khởi tạo đối tượng Painter
function Painter (context, width, height) {
    this.context = context;
    this.imageData = context.createImageData(width, height);
    this.points = [];
    this.now = [-1, -1]; 
    this.width = width;
    this.height = height;

// hàm getPixelIndex lấy thông tin của pixel tjai (x,y) cho trước
    this.getPixelIndex = function(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return -1;
        return (x + y * width) << 2;
    }

// hàm setPixel đặt màu cho pixel tại (x,y) cho trước
    this.setPixel = function(x, y, rgba) { 
        pixelIndex = this.getPixelIndex(x, y); 
        if (pixelIndex == -1) return; 
        for (var i = 0; i < 4; i++) {
            this.imageData.data[pixelIndex + i] = rgba[i];
        }
    }
// hàm vẽ điểm
    this.drawPoint = function(p, rgba){
        var x = p[0];
        var y = p[1];
        for (var i = -1; i <= 1; i++)
            for (var j = -1; j <= 1; j++)
                this.setPixel(x + i, y + j, rgba);
    }
// hàm vẽ đường thẳng
    this.drawLine = function(p1, p2, rgba) {
        var x0 = p1[0], y0 = p1[1];
        var x1 = p2[0], y1 = p2[1];
        var dx = x1 - x0, dy = y1 - y0;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (x0 > x1) {
                var t = x0; x0 = x1; x1 = t;
                t = y0; y0 = y1; y1 = t;
                dx = -dx; dy = -dy;
            }
            var y = y0;
            var k = dy / dx;
            for (var x = x0; x <= x1; x++) {
                this.setPixel(x, y, rgba);
                y = y + k;
            }
        }
        else {
            if (y0 > y1) {
                var tx = x0; x0 = x1; x1 = tx;
                var ty = y0; y0 = y1; y1 = ty;
            }
            var x = x0;
            var k = dx / dy;
            for (var y = y0; y <= y1; y++) {
                this.setPixel(Math.floor(x+0.5), y, rgba);
                x = x + k;
            }
        }
    }
    this.drawBkg = function(rgba) {
        for (var i = 0; i < this.width; i++)
            for (var j = 0; j < this.height; j++)
                this.setPixel(i, j, rgba);
    } 
    this.clear = function() {
        this.points.length = 0;
        this.drawBkg(bgRgba);
        this.context.putImageData(this.imageData, 0, 0);
    }

    this.draw = function(p) {
        if (this.now[0] != -1) {
            this.drawLine(this.now, p, lineRgba);
            this.now = p;
        }
        else {
            this.now = p;
        }
    }
    this.addPoint = function(p) {
        this.points.push(p);
    }
    this.clear();
    this.draw();
}

state = 0; // 0: waiting 1: drawing 2: finished
clickPos = [-1, -1];
var painter = new Painter(context, width, height);

var p1 = [100, 100]; // Điểm đầu
var p2 = [300, 300]; // Điểm cuối
painter.draw(p1, p2, lineRgba); // Vẽ đường thẳng từ p1 đến p2

// các hàm xử lý chuột và bàn phím
getPosOnCanvas = function(x,y) {
    var bbox = canvas.getBoundingClientRect();
    return [Math.floor(x - bbox.left * (canvas.width / bbox.width)+ 0.5),
            Math.floor(y - bbox.top * (canvas.height / bbox.height) + 0.5)];
}

doMouseMove = function (e) {
    if (state ==0 || state ==2){
        return;
    }
    var p = getPosOnCanvas(e.clientX, e.clientY);
    painter.draw(p);
}
doMouseDown = function (e) {
    if(state == 2 || e.button !=0){
        return;
    }
    var p = getPosOnCanvas(e.clientX, e.clientY);
    painter.addPoint(p);  // add point not a function   
    painter.draw(p);
    if(state ==0){
        state = 1;
    }
}
doKeyDown = function (e) {
    if( state == 2){
        return;
    }
    var keyID = e.keyCode ? e.keyCode : e.which;
    if(keyID == 27 && state == 1){
        state = 2;
        painter.draw(painter.points[painter.points.length - 1]);
    }
}

canvas.addEventListener('mousemove', doMouseMove);
canvas.addEventListener('mousedown', doMouseDown);
document.addEventListener('keydown', doKeyDown);

var resetButton = document.getElementById("reset");
resetButton.addEventListener("click", doReset, false);