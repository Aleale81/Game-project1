

class Game {
    constructor(){
        this.player = null;
        this.pigeons = [];
        this.bullets = [];
    };
    start(){
        this.player = new Player();
        this.playerEventListener()

        setInterval(() => {
            const newPigeons = new Pigeons();
            this.pigeons.push(newPigeons);
        }, 6000);

        setInterval(() => {
            this.pigeons.forEach((pigeon) => {
                pigeon.move();               
                this.removePigeonOut(pigeon)
            });
        }, 40 )
        setInterval(() => {
            this.bullets.forEach((bullet) => {
                bullet.shoot();
                this.removeBulletOut(bullet);
            })
        }, 10)
        
    };

    playerEventListener(){
        document.addEventListener('keydown', (event) => {
            this.player.move(event.key);
            if(event.key === ' '){
                const newBullets = new Bullets(this.player.positionX + (this.player.width / 2) , this.player.positionY + this.player.heigth);
                this.bullets.push(newBullets);
                console.log(this.bullets)
            }
        })
    };

    detectCollision(){
        
    };
    
    removePigeonOut(pigeon){  
        if((pigeon.positionX + pigeon.width)  >= 100){
            pigeon.divElm.remove();
            this.pigeons.shift();           
        } 
    };
    removeBulletOut(bullet){
        if((bullet.positionY + bullet.width) >= 100){
            console.log('removing')
            bullet.divElm.remove();
            this.bullets.shift();
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
};

class Bullets {
    constructor(positionX, positionY){
        this.width = 1;
        this.heigth = 1;
        this.positionX = positionX;
        this.positionY = positionY;
        this.divElm = null;
        this.color = 'black'
        //this.speed = 0.1;
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
        console.log('shoooooooting')
        this.positionY++;
        this.divElm.style.bottom = this.positionY + "%";
    }
};

const game = new Game();
game.start();