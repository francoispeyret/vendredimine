
import Case from '../classes/Case';

class Rules {
    constructor() {
        this.answer = 42;
        this.casesX = 10;
        this.casesY = 10;

    }
    setEndGame() {
        confirm('Jeu terminé, tu es trop mauvais..')
    }
    setNewGame(ctx) {
        console.log();

        let newCases = [];

        for(let x = 0; x < this.casesX; x++) {
            for(let y = 0; y < this.casesY; y++) {
                let mine = Math.floor(Math.random() * Math.floor(10));
                newCases[x+':'+y] = new Case(
                    x,y,
                    ctx,
                    mine > 8
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

export default Rules;
