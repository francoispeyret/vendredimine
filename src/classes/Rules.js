

var Case = require('./Case.js')

class Rules {
    constructor() {
        this.version = 1.0;
        this.answer = 42;
        this.casesX = 10;
        this.casesY = 10;
        this.maxRandom = 10;
        this.randomDifficulty = 1;
    }
    setEndGame() {
        confirm('Jeu terminé, tu es trop mauvais..')
    }
    setNewGame(ctx,images) {
        console.log('setNewGame()');

        let newCases = {};

        for(let x = 0; x < this.casesX; x++) {
            for(let y = 0; y < this.casesY; y++) {
                let mine = Math.floor(Math.random() * Math.floor(this.maxRandom));
                newCases[x+':'+y] = new Case(
                    x,y,
                    ctx,
                    mine <= this.randomDifficulty,
                    images
                )
            }
        }
        for(let x = 0; x < this.casesX; x++) {
            for(let y = 0; y < this.casesY; y++) {
                newCases[x+':'+y].getClosest(newCases);
            }
        }

        return newCases;
    }
}


module.exports = Rules;
