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

        let xCible = Math.floor((data.position.x-8)/49);
        let yCible = Math.floor((data.position.y-8)/49);

        console.log('xCible',xCible);
        console.log('yCible',yCible);

        if(typeof gameMap[xCible+':'+yCible] !== 'undefined') {
            if(gameMap[xCible+':'+yCible].safeMode === false) {
                gameMap[xCible+':'+yCible].setClicked();
                if(gameMap[xCible+':'+yCible].closestNumber===0) {
                    gameMap[xCible+':'+yCible].clickClosest(gameMap,xCible,yCible);
                }
                let map = JSON.stringify(gameMap);
                io.sockets.emit('load the map',map);
                if(gameMap[xCible+':'+yCible].mine === true) {
                    console.log('GAMEOVER');
                    io.sockets.emit('gameover',map);
                }
            }
        }
    });
    socket.on('rightClick', (data)=> {
        console.log(data);

        let xCible = Math.floor((data.position.x-8)/49);
        let yCible = Math.floor((data.position.y-8)/49);

        console.log('xCibleRightClick',xCible);
        console.log('xCibleRightClick',yCible);

        if(typeof gameMap[xCible+':'+yCible] !== 'undefined') {
            if(gameMap[xCible+':'+yCible].clicked == false) {
                gameMap[xCible+':'+yCible].setRightClicked();
                console.log(gameMap[xCible+':'+yCible].safeMode);
                let map = JSON.stringify(gameMap);
                io.sockets.emit('load the map',map);
            }
        }
    });

    socket.on('getNewGame', () => {
        console.log('getNewGame');
        gameMap = gameRules.setNewGame(null,null);
        let newMapData = JSON.stringify(gameMap);
        io.sockets.emit('load the map',newMapData);
    });

});
