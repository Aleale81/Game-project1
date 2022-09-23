

class Game {
    constructor(){
        this.player = null;
        this.pigeons = [];
        this.bullets = [];
        this.poops = [];
        this.pointsDisplayer = null;
        this.points = 0;
        this.gameOver = null;
        this.intervalDelay = 2000;
        this.currentLevel = 1;
        this.level2 = { level: 2, positionX: pigeon.positionX, positionY:  Math.floor(Math.random() * 50 - 6)+ 50 , img: pigeon.img, speed: pigeon.speed, point: 7};
        this.level3 = { level: 3, positionX: pigeon.positionX , positionY: 50, img: pigeon.img, speed: 0.6, point: pigeon.point};
        this.level4 = [{ level: 4, width: pigeon.width, heigth: pigeon.heigth, positionX: pigeon.positionX , positionY: 80, img: pigeon.img, id: pigeon.id,icon: pigeon.icon, speed: 0.8, point: 5},
            { level: 4, width: pigeon.width, heigth: pigeon.heigth, positionX: pigeon.positionX , positionY: 60, img: "url('./img/pigeon-level4.png')", id: pigeon.id,icon: pigeon.icon, speed: 0.8, point: 7}];
    };
    start(){
        this.player = new Player(player.width, player.heigth, player.positionX, player.positionY, player.img, player.id, player.icon, player.speed);
        this.pointsDisplayer = new Points(points.width, points.heigth, points.positionX, points.positionY, points.img, points.id,  points.icon);
        this.displayPoints(this.points)
        this.playerEventListener()

        setInterval(() => {
            const newPigeons = new Pigeons(pigeon.width, pigeon.heigth, pigeon.positionX, pigeon.positionY, pigeon.img, pigeon.id, pigeon.icon, pigeon.speed, pigeon.point);
            this.pigeons.push(newPigeons);
            this.checkLevelChange()
        }, this.intervalDelay);

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
        },30); 

        setInterval(() => {
            if(this.currentLevel === 4){
                const newPigeons = new Pigeons(this.level4[1].width, this.level4[1].heigth, this.level4[1].positionX, this.level4[1].positionY, this.level4[1].img, this.level4[1].id, this.level4[1].icon, this.level4[1].speed, this.level4[1].point);
                this.pigeons.push(newPigeons);
            }          
        }, this.intervalDelay + 700);
        
        
    };

    playerEventListener(){
        document.addEventListener('keydown', (event) => {
            this.player.move(event.key);
            if(event.key === ' '){
                const newBullets = new Bullets(bullets.width, bullets.heigth, this.player.positionX + (this.player.width / 2), this.player.positionY + this.player.heigth , bullets.img, bullets.id, bullets.icon, bullets.speed, bullets.point );
                this.bullets.push(newBullets);
                const popSound = new Audio("./sound/pop.wav"); // buffers automatically when created
                popSound.play(); 
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
                const birdSound = new Audio("./sound/bird.mp3"); // buffers automatically when created
                birdSound.play();
                this.displayPoints(pigeon.point)
                pigeon.divElm.remove();
                this.pigeons.splice(pigeonIndex,1)
                this.bullets.splice(index, 1);
                bullet.divElm.remove()
                const newPoop = new Poops(poops.width, poops.heigth, releasePositionX, releasePositionY , poops.img, poops.id, poops.icon, poops.speed, poops.point );              
                this.poops.push(newPoop) 
                document.querySelector('.fa-poo').style.color = this.randomColorGeneretor();               
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
            this.player.divElm.classList.add("rotated");
            const squishSound = new Audio("./sound/squish2.wav"); // buffers automatically when created
            squishSound.play();                    
            setTimeout(()=> {this.gameOverPopUp();}, 1200);            
        }
    };
    gameOverPopUp(){
        this.gameOver = new GameOver();
        const boardElm = document.querySelector('#board');
        boardElm.style.opacity = '0.3';
        this.gameOver.divElm.innerHTML = `<h1>Game Over!</h1><button>TRY AGAIN</button> <p>Total Score: ${this.points}</p>`
        document.addEventListener('click', (event) => {
            location.reload()
        })
    };
    randomColorGeneretor(){
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return  `rgb(${r} , ${g} ,${b})`
    };
    displayPoints(point){
        this.points += point;
        this.pointsDisplayer.divElm.innerHTML = `<h3>Points: ${this.points}<h3> <h4> Level: ${this.currentLevel}<h4>`;       
    }; 
    removePigeonOut(pigeon){  
        if((pigeon.positionX + pigeon.width)  >= 100 || pigeon.positionX + pigeon.width < 0){
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
    checkLevelChange(){
        if(this.points >= 10  && this.points < 30){ 
            this.intervalDelay -= 100;          
            this.upgradeLevels(this.level2);           
        } else if(this.points >= 30 && this.points < 60){
            this.intervalDelay -= 100;
            this.upgradeLevels(this.level3);           
        } else if(this.points >= 60){
            this.intervalDelay -= 200;
            this.upgradeLevels(this.level4[0]);           
        } 
    };
    upgradeLevels(level){
        this.currentLevel = level.level;
        pigeon.positionX = level.positionX;
        pigeon.positionY = level.positionY;
        pigeon.img = level.img;
        pigeon.speed = level.speed;
        pigeon.point = level.point;
    };
    
};

class GameElement {
    constructor(width, heigth, positionX, positionY, img, id, icon, speed){
        this.width = width;
        this.heigth = heigth;
        this.positionX = positionX
        this.positionY = positionY;
        this.divElm = null;
        this.img = img
        this.id = id;
        this.icon = icon;
        this.speed = speed;
    };

    createDivElm(){
        const parentElm = document.querySelector('#board');
        this.divElm = document.createElement('div');
        this.divElm.classList = this.id;
        this.divElm.innerHTML = this.icon;
        this.divElm.style.backgroundImage = this.img;
        this.divElm.style.width = this.width + "%";
        this.divElm.style.height = this.heigth + "%";
        this.divElm.style.bottom = this.positionY + "%";
        this.divElm.style.left = this.positionX + "%"
        parentElm.appendChild(this.divElm);
    };
};

class Player extends GameElement {
    constructor(width, heigth, positionX, positionY, img, id,icon, speed){
        super(width, heigth, positionX, positionY, img, id,icon, speed)
        this.width = width;
        this.heigth = heigth;
        this.positionX = positionX
        this.positionY = positionY;
        this.divElm = null;
        this.img = img;
        this.id = id;
        this.speed = speed;
        this.createDivElm();
    };

    move(key){
        switch(key){
            case 'ArrowLeft' :              
                if(this.positionX > 0 && this.positionX <= (100 - this.width)){
                   this.positionX -= this.speed; 
                } else {
                    this.positionX = 0;
                }
                this.divElm.style.left = this.positionX + "%";
                break;       
            case 'ArrowRight' :                       
                if(this.positionX >= 0 && this.positionX < (100 - this.width)){
                    this.positionX += this.speed; 
                }  else {
                    this.positionX = 100 - this.width;
                } 
                this.divElm.style.left = this.positionX + "%"; 
                break;                            
        }
    }     
};

class Pigeons extends GameElement{
    constructor(width, heigth, positionX, positionY, img, id, icon, speed, point){
        super(width, heigth, positionX, positionY, img, id, icon, speed,)
        this.width = width;
        this.heigth = heigth;
        this.positionX = positionX;
        this.positionY = positionY;
        this.divElm = null;
        this.img = img;
        this.speed = speed;
        this.point = point;
        this.createDivElm();
    };

    move(){
        this.positionX += this.speed;
        this.divElm.style.left = this.positionX + "%"
        }
};

class Bullets extends GameElement{
    constructor(width, heigth, positionX, positionY, img, id, icon, speed){
        super(width, heigth, positionX, positionY, img, id, icon, speed)
        this.width = width;
        this.heigth = heigth;
        this.positionX = positionX;
        this.positionY = positionY;
        this.divElm = null;
        this.img = img
        this.id = id;
        this.icon = icon;
        this.speed = speed;
        this.createDivElm();
    };

    shoot(){
        this.positionY += this.speed;
        this.divElm.style.bottom = this.positionY + "%";
    }
};

class Poops extends GameElement{   
    constructor(width, heigth, positionX, positionY, img, id, icon, speed){
        super(width, heigth, positionX, positionY, img, id, icon, speed)
        this.width = width;
        this.heigth = heigth;
        this.positionX = positionX;
        this.positionY = positionY;
        this.divElm = null;
        this.img = img;
        this.id = id;
        this.icon = icon;
        this.speed = speed;
        this.createDivElm();

    };
    fall(){
        this.positionY -= this.speed;
        this.divElm.style.bottom = this.positionY + "%";
    }
};

class Points extends GameElement{
    constructor(width, heigth, positionX, positionY, img, id, icon){
        super(width, heigth, positionX, positionY, img, id, icon)
        this.width = width;
        this.height = heigth;
        this.positionX = positionX;
        this.positionY = positionY;
        this.divElm = null;
        this.img = img;
        this.id = id;
        this.icon = icon;
        this.createDivElm();       
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

const player = {width: 12, heigth: 18, positionX: 45, positionY: 0, img: "url('./img/old1.png')", id:"player", icon:null, speed: 3};
const pigeon = {width: 6, heigth: 6, positionX: 0, positionY: 70, img: "url('./img/pigeon-fly.png')", id:"pigeons", icon: null, speed: 0.4, point:5};
const bullets = {width: 1, heigth: 1, positionX: null, positionY: null, img: null, id: 'bullets', icon: '<i class="fa-solid fa-bomb"></i>', speed: 1};
const poops = {width: 2, heigth: 2, positionX: null, positionY: null, img: null, id: 'poops', icon: '<i class="fa-solid fa-poo"></i>', speed: 1}
const points = {width: 24, heigth: 60, positionX: 110, positionY: 20, img: "url('./img/pigeon-board.jpeg')", id: 'points' , icon: null}


const game = new Game();
game.start();