

class Game {
    constructor(){
        this.player = null;
        this.pigeons = [];
        this.bullets = [];
        this.poops = [];
        this.pointsDisplayer = null;
        this.points = 0;
        this.gameOver = null;
    };
    start(){
        this.player = new Player();
        this.pointsDisplayer = new Points();
        this.displayPoints(this.points)
        this.playerEventListener()

        setInterval(() => {
            const newPigeons = new Pigeons();
            this.pigeons.push(newPigeons);
        }, 2000);

        setInterval(() => {
            this.pigeons.forEach((pigeon,pigeonIndex) => {
                pigeon.move();               
                this.removePigeonOut(pigeon);
                this.detectCollisionBulletPigeon(pigeon, pigeonIndex);
            });
        }, 50);

        setInterval(() => {
            this.bullets.forEach((bullet) => {
                bullet.shoot();
                this.removeBulletOut(bullet);
            })
        }, 10);

        setInterval(() => {
            this.poops.forEach((poop, poopIndex) => {
                poop.fall()                
                this.removePoopOut(poop)
                this.detectCollisionPlayerPoop(poop, poopIndex)
            })
        },30)
        
    };

    playerEventListener(){
        document.addEventListener('keydown', (event) => {
            this.player.move(event.key);
            if(event.key === ' '){
                const newBullets = new Bullets(this.player.positionX + (this.player.width / 2) , this.player.positionY + this.player.heigth);
                this.bullets.push(newBullets);
            }
        })
    };

    detectCollisionBulletPigeon(pigeon, pigeonIndex){

        this.bullets.forEach((bullet, index) => {
            if(
            pigeon.positionX < (bullet.positionX + bullet.width) && 
            (pigeon.positionX + pigeon.width) > bullet.positionX && 
            bullet.positionY >= pigeon.positionY )
            {   let releasePositionX = pigeon.positionX - (pigeon.width / 2);
                let releasePositionY = pigeon.positionY;
                this.displayPoints(pigeon.point)
                pigeon.divElm.remove();
                this.pigeons.splice(pigeonIndex,1)
                this.bullets.splice(index, 1);
                bullet.divElm.remove()
                const newPoop = new Poops(releasePositionX , releasePositionY);              
                this.poops.push(newPoop)                
            }
        })            
    };

    detectCollisionPlayerPoop(poop, poopIndex){
        if(
        this.player.positionX < (poop.positionX + poop.width) && 
        (this.player.positionX + this.player.width) > poop.positionX && 
        this.player.positionY < (poop.positionY + poop.width) && 
        (this.player.positionY + this.player.width) > poop.positionY 
        ){
            poop.divElm.remove();
            this.poops.slice(poopIndex, 1)
            this.player.divElm.className = "rotated";
            this.gameOverPopUp();
        }
    };

    gameOverPopUp(){
        this.gameOver = new GameOver();
        const boardElm = document.querySelector('#board');
        boardElm.style.opacity = '0.3';
        this.gameOver.divElm.innerHTML = `<h1>Game Over!</h1><button>TRY AGAIN</button> <p>Total Score: ${this.points}</p>`
        const button = document.querySelector('#game_over button')
        document.addEventListener('click', (event) => {
            console.log(event)
            location.reload()
        })
    };

    displayPoints(point){
        this.points += point;

        this.pointsDisplayer.divElm.innerHTML = `<h3>Points: ${this.points}<h3> <h3> Level: 1<h3>`;
    };
    removePigeonOut(pigeon){  
        if((pigeon.positionX + pigeon.width)  >= 100){
            pigeon.divElm.remove();
            this.pigeons.shift();           
        } 
    };
    removeBulletOut(bullet){
        if((bullet.positionY + bullet.width) >= 100){
            bullet.divElm.remove();
            this.bullets.shift();
        }
    };
    removePoopOut(poop){
        if(poop.positionY <= 0 ){
            this.poops.shift(poop);
            poop.divElm.remove()
        }
    };
    
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
                            
        }
    }     
        
    



};

class Pigeons {
    constructor(){
        this.width = 6;
        this.heigth = 6;
        this.positionX = 0;
        this.positionY = 70;
        this.divElm = null;
        this.color = 'grey'
        this.speed = 0.4;
        this.point = 5;
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
        this.positionX += this.speed;
        this.divElm.style.left = this.positionX + "%"
        }
};

class Bullets {
    constructor(positionX, positionY){
        this.width = 1;
        this.heigth = 1;
        this.positionX = positionX;
        this.positionY = positionY;
        this.divElm = null;
        this.color = 'black'
        this.speed = 1;
        this.createDivElm();
    };
    
    createDivElm(){
        const parentElm = document.querySelector('#board');
        this.divElm = document.createElement('div');
        this.divElm.classList = 'bullets';
        this.divElm.style.backgroundColor = this.color;
        this.divElm.style.width = this.width + "%";
        this.divElm.style.height = this.heigth + "%";
        this.divElm.style.bottom = this.positionY  + "%";
        this.divElm.style.left = this.positionX + "%";

        parentElm.appendChild(this.divElm);
    };
    shoot(){
        this.positionY += this.speed;
        this.divElm.style.bottom = this.positionY + "%";
    }
};

class Poops {   
    constructor(positionX, positionY){
        this.width = 2;
        this.heigth = 2;
        this.positionX = positionX;
        this.positionY = positionY;
        this.divElm = null;
        this.color = 'brown'
        this.speed = 1;
        this.createDivElm();
    };
    
    createDivElm(){
        const parentElm = document.querySelector('#board');
        this.divElm = document.createElement('div');
        this.divElm.classList = 'poops';
        this.divElm.style.backgroundColor = this.color;
        this.divElm.style.width = this.width + "%";
        this.divElm.style.height = this.heigth + "%";
        this.divElm.style.bottom = this.positionY  + "%";
        this.divElm.style.left = this.positionX + "%";

        parentElm.appendChild(this.divElm);
    };
    fall(){
        this.positionY -= this.speed;
        this.divElm.style.bottom = this.positionY + "%";
    }
};

class Points {
    constructor(){
        this.width = 24;
        this.height = 18;
        this.positionX = 110;
        this.positionY = 40;
        this.divElm = null;
        this.color = 'orange'
        this.createDivElm();       
    };
    createDivElm(){
        const parentElm = document.querySelector('#board');
        this.divElm = document.createElement('div');
        this.divElm.id = 'points';
        this.divElm.style.backgroundColor = this.color
        this.divElm.style.width = this.width + "%";
        this.divElm.style.height = this.heigth + "%";
        this.divElm.style.bottom = this.positionY  + "%";
        this.divElm.style.left = this.positionX + "%";

        parentElm.appendChild(this.divElm);
    };

};

class GameOver {
    constructor(){
        this.divElm = null;
        this.color = 'white'
        this.createDivElm();
    };

    createDivElm(){
        const parentElm = document.querySelector('body');
        this.divElm = document.createElement('div');
        this.divElm.id = 'game_over';
        this.divElm.style.backgroundColor = this.color
        parentElm.appendChild(this.divElm);
    };
};


const game = new Game();
game.start();