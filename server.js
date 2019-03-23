var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('dist'))

console.log('server running ...');


var socket = require('socket.io');

var io = socket(server);



const Rules = require('./src/classes/Rules.js');
const gameRules = new Rules();
let gameMap = gameRules.setNewGame(null,null);

io.sockets.on('connection', socket => {
    console.log('newConnection - '+socket.id);
        let data = JSON.stringify(gameMap);
        io.sockets.emit('load the map',data);

        socket.on('mouse', function(data) {
            socket.broadcast.emit('mouse',data);
        });
});
