var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Khởi tạo đối tượng Painter
function Painter(context, width, height) {
    this.context = context;
    this.imageData = context.createImageData(width, height);
    this.width = width;
    this.height = height;

    this.drawLine = function(x0, y0, x1, y1, color) {
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            const index = (y0 * this.width + x0) * 4;
            this.imageData.data[index] = color.r;
            this.imageData.data[index + 1] = color.g;
            this.imageData.data[index + 2] = color.b;
            this.imageData.data[index + 3] = color.a;

            if (x0 === x1 && y0 === y1) {
                break;
            }

            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }
}

var painter = new Painter(context, canvas.width, canvas.height);

// Example usage
var color = { r: 0, g: 0, b: 0, a: 255 }; // Màu đen
painter.drawLine(0, 0, 100, 100, color); // Vẽ đường thẳng từ (0, 0) đến (100, 100)

// Update canvas với imageData mới
context.putImageData(painter.imageData, 0, 0);
