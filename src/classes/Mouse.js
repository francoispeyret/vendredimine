let Mouse = {
    position: {
      x: 0,
      y: 0,
    },
    mouseOver(e,socket) {
        Mouse.position.x = e.clientX;
        Mouse.position.y = e.clientY;
        socket.emit('mouse',Mouse.position);
    }
}

export default Mouse;
