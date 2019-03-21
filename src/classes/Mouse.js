let Mouse = {
    position: {
      x: 0,
      y: 0,
    },
    mouseOver(e) {
        Mouse.position.x = e.clientX;
        Mouse.position.y = e.clientY;
    }
}

export default Mouse;
