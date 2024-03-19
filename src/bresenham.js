function drawLine(context, x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
  
    while (x1 !== x2 || y1 !== y2) {
      // Draw the current point (x1, y1)
      context.fillRect(x1, y1, 1, 1); // Vẽ một pixel tại tọa độ (x1, y1)
  
      const err2 = 2 * err;
  
      if (err2 > -dy) {
        err -= dy;
        x1 += sx;
      }
  
      if (err2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  
    // Draw the last point (x2, y2)
    context.fillRect(x2, y2, 1, 1); // Vẽ một pixel tại tọa độ (x2, y2)
  }
  
  // Example usage
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  drawLine(context, 0, 0, 100, 300);
  