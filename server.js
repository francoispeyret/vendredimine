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
        socket.on('click', (data)=> {
            console.log(data);

            let xCible = Math.floor((data.position.x-8)/29);
            let yCible = Math.floor((data.position.y-8)/29);

            console.log('xCible',xCible);
            console.log('yCible',yCible);

            if(typeof gameMap[xCible+':'+yCible] !== 'undefined') {
                gameMap[xCible+':'+yCible].setClicked();
                if(gameMap[xCible+':'+yCible].closestNumber===0) {
                    gameMap[xCible+':'+yCible].clickClosest(gameMap,xCible,yCible);
                }
                let map = JSON.stringify(gameMap);
                io.sockets.emit('load the map',map);
            }


        });
});

