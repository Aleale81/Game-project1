

class Game {
    constructor(){
        this.player = null;
        this.pigeons = [];
    };
    start(){
        this.player = new Player();
        console.log("let's play!")
        this.playerEventListener()

        setInterval(() => {
            const newPigeons = new Pigeons();
            this.pigeons.push(newPigeons);
        }, 4000);

        setInterval(() => {
            this.pigeons.forEach((pigeon) => {
                pigeon.move();
                console.log(pigeon)
                this.removePigeonOut(pigeon);
            }, 0 )
        })
    };

    playerEventListener(){
        document.addEventListener('keydown', (event) => {
            this.player.move(event.key)
        })
    };
    removePigeonOut(pigeon){
        console.log(pigeon.positionX)
        
        if(Number(pigeon.positionX - pigeon.width)  >= 100){
            pigeon.divElm.remove();
           this.pigeons.shift();
           
            
        } 

    }
    
};

class Player {
    constructor(){
        this.width = 10;
        this.heigth = 10;
        this.positionX = 45
        this.positionY = 0;
        this.divElm = null;
        this.color = 'blue'
        this.createDivElm();
    };

    createDivElm(){
        const parentElm = document.querySelector('#board');
        this.divElm = document.createElement('div');
        this.divElm.id = 'player';
        this.divElm.style.backgroundColor = this.color
        this.divElm.style.width = this.width + "%";
        this.divElm.style.height = this.heigth + "%";
        this.divElm.style.bottom = this.positionY + "%";
        this.divElm.style.left = this.positionX + "%"

        parentElm.appendChild(this.divElm);
    };

    move(key){
        switch(key){

        
            case 'ArrowLeft' :              
                if(this.positionX > 0 && this.positionX <= (100 - this.width)){
                   this.positionX -= 3; 
                } else {
                    this.positionX = 0;
                }
                this.divElm.style.left = this.positionX + "%";
                break;
            
        
            case 'ArrowRight' :                       
                if(this.positionX >= 0 && this.positionX < (100 - this.width)){
                    this.positionX += 3; 
                }  else {
                    this.positionX = 100 - this.width;
                } 
                this.divElm.style.left = this.positionX + "%"; 
                break;
                
           // case 'ArrowUp'
           // case 'ArroeDown'
           // case ' ' : spacebar for shooting...
                
        }
    }     
        
    



};

class Pigeons {
    constructor(){
        this.width = 8;
        this.heigth = 6;
        this.positionX = 0;
        this.positionY = 70;
        this.divElm = null;
        this.color = 'grey'
        //this.speed = 0.1;
        this.createDivElm();
    };
    
    createDivElm(){
        const parentElm = document.querySelector('#board');
        this.divElm = document.createElement('div');
        this.divElm.classList = 'pigeons';
        this.divElm.style.backgroundColor = this.color
        this.divElm.style.width = this.width + "%";
        this.divElm.style.height = this.heigth + "%";
        this.divElm.style.bottom = this.positionY + "%";
        this.divElm.style.left = this.positionX + "%"

        parentElm.appendChild(this.divElm);
    };

    move(){

            this.positionX += 0.1;
            this.divElm.style.left = this.positionX + "%"
        }
        



}

const game = new Game();
game.start();