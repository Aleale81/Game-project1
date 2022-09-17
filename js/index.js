

class Game {
    constructor(){
        this.player = null;
    };
    start(){
        this.player = new Player;
        console.log("let's play!")
    }
    
};

class Player {
    constructor(){
        this.width = 80;
        this.heigth = 80;
        this.positionX = 50;
        this.positionY = 0;
        this.divElm = null;
        this.createDivElm();


    };

    createDivElm(){
        const parentElm = document.querySelector('#board');
        this.divElm = document.createElement('div');
        this.divElm.id = 'player';
        this.divElm.style.backgroundColor = "blue"
        this.divElm.style.width = this.width + "px";
        this.divElm.style.height = this.heigth + "px";
        this.divElm.style.bottom = this.positionY + "%";
        this.divElm.style.left = this.positionX + "%"

        parentElm.appendChild(this.divElm);


    }
};

const game = new Game();
game.start();