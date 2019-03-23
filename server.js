var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('dist'))

console.log('server running ...');


var socket = require('socket.io');

var io = socket(server);



const Rules = require('./src/classes/Rules.js');
const gameRules = new Rules();
const game = {
    map: gameRules.setNewGame(null,null)
}

io.sockets.on('connection', function(socket){

        var mapJson = JSON.stringify(game.map);
        console.log(mapJson);
        console.log(game.map);

        socket.json.emit('init',game.map);

        console.log('newConnection - '+socket.id);
        socket.on('mouse', function(data) {
            socket.emit('mouse',data);
        });
});
