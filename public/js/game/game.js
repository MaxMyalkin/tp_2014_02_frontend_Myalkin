define(['classy', 'game/objects/player', 'game/mechanics', 'game/resources'], 
function(Class, Player, GameMechanic, Resources){
 /* TODO multiplayer
		sounds
		multiplayer
        bonuses +-
         */
    var Game = Class.$extend({
         
        __init__: function (){
            var DEBUG = false;
            this.resources = new Resources();
            //Константы
            this.DELAY = 50;
            this.GAME_WIDTH = 1024;
            this.GAME_HEIGHT = 768;
            
            this.PLAYER_RADIUS = this.resources.playerImgD/2;
            this.PLAYER_START_X = this.GAME_WIDTH/2;
            this.PLAYER_START_Y = this.GAME_HEIGHT - this.PLAYER_RADIUS - 10;
            this.ROCKET_SPEED = 10;
            this.ASTEROID_SPEED = 5;

            this.FONT_SIZE = 50;
            this.HORIZONTAL_SPEED = 7;
            this.FORWARD_SPEED = 10;
            this.BACK_SPEED = 7;
            this.ASTEROID_TIMEOUT = 50;
            this.BULLET_TIMEOUT = 25;
            this.BONUS_TIMEOUT = 500;
 			this.BONUS_TERMINATE = 200 
            //Переменные
            this.bulletTimer = 0;
            this.asteroidTimer = 0;
            this.bonusTimer = 0;         
            this.firstTime = true;
            this.startTime = false;
            this.pauseFlag = false;
            this.gameover = false;
            this.stopped = true;
            this.asteroids = [];
            this.keydown = [];
            this.bangs = [];
            this.bonuses = [];
            this.gameMechanic = new GameMechanic();
            var canvas = document.getElementById("game");
            canvas.width = this.GAME_WIDTH;
            canvas.height = this.GAME_HEIGHT;
            this.context = canvas.getContext("2d");
            this.context.fillStyle = "#ffffff";
            this.context.debug = DEBUG;
            this.player = new Player("#ffffff", this.PLAYER_START_X, this.PLAYER_START_Y, 
                this.PLAYER_RADIUS, this.resources.playerImg);
                       
            var game = this;
            $(document).bind("keydown", function(event) {
                game.keydown[String.fromCharCode(event.which).toLowerCase()] = true;
            });
             $(document).bind("keyup", function(event) {
                game.keydown[String.fromCharCode(event.which).toLowerCase()] = false;
            });

            this.restart = document.getElementById("restart");
            this.restart.onclick = this.restartGame.bind(game);
            this.pauseBtn = document.getElementById("pause");
            this.pauseBtn.onclick = this.pauseGame.bind(game);
            this.backBtn = document.getElementById("backBtn");
            this.backBtn.onclick = this.endGame.bind(game);
            this.interval;
            this.reloading(true);
           	this.setBtnText();
        },

        setBtnText: function() {
        	
        	if (this.pauseFlag) {
        		this.pauseBtn.innerHTML = "Continue";
        	}
        	else {
        		this.pauseBtn.innerHTML = "Pause";
        	}
        	if (this.gameover) {
        		this.restart.innerHTML = "Restart";
        	}
        	if(this.stopped){
        		this.restart.innerHTML = "Play";
        	}
        	else {
        		this.restart.innerHTML = "Restart";	
        	}
        },

        movePlayer: function (){
 
            if (!this.gameover && !this.pauseFlag && !this.stopped ){
                if (this.keydown["a"]) {
                	this.player.move(-this.HORIZONTAL_SPEED , 0 , this.GAME_WIDTH , this.GAME_HEIGHT);
                    this.player.sprite.url = this.resources.playerLeftImg;
                }
        		if (this.keydown["d"]){
                    this.player.move(this.HORIZONTAL_SPEED , 0 , this.GAME_WIDTH , this.GAME_HEIGHT);
                    this.player.sprite.url = this.resources.playerRightImg;
                }
                if (this.keydown["p"]){
                    if (this.bulletTimer > this.BULLET_TIMEOUT){
                        this.player.launchBullet(this , 1);
                        this.bulletTimer = 0;
                    }
                }
                if (!this.keydown["a"] && !this.keydown["d"]){
                    this.player.sprite.url = this.resources.playerImg;
                }
                if (this.keydown["w"]) {
                	this.player.move(0 , -this.FORWARD_SPEED , this.GAME_WIDTH , this.GAME_HEIGHT);
                }
                if (this.keydown["s"]) {
                	this.player.move(0 , this.BACK_SPEED , this.GAME_WIDTH , this.GAME_HEIGHT);
                }
                if(this.keydown["q"]) {
                	if( this.bulletTimer > this.BULLET_TIMEOUT && this.player.bonusBullets[0] > 0) {
                		this.player.launchBullet(this , 2);
                		this.bulletTimer = 0;	
                		this.player.bonusBullets[0] -=1;
                	}
              
                }
                if(this.keydown["e"]) {
                	if( this.bulletTimer > this.BULLET_TIMEOUT && this.player.bonusBullets[1] > 0) {
                		this.player.launchBullet(this , 3);
                		this.bulletTimer = 0;	
                		this.player.bonusBullets[1] -=1;
                	}
              
                }
                
            }
        },

        reloading: function(flag){
            if (flag){
                var game = this;
                this.interval = setInterval(function(){ game.play(); game.movePlayer(); }, 1000 / this.DELAY);
            }else{
                clearInterval(this.interval);
            }
        },
 
        restartGame: function(){
            if (this.pauseFlag)
                this.reloading(true);
        	this.endGame();
            this.gameover = false;
            this.pauseFlag = false;
            this.stopped = false;
            this.setBtnText();
        },
 
        pauseGame: function(){
	            if(!this.gameover && !this.stopped){
		            if (this.pauseFlag ){
		                this.pauseFlag = false;
                        this.reloading(true);
		            }
		            else {
		                this.pauseFlag = true;
                        this.reloading(false);
                        this.play();
		            }
	            }
	            this.setBtnText();

        }, 
 
        play: function(){
            if ( !this.gameover && !this.pauseFlag && !this.stopped) {
                this.asteroidTimer += 1;
                this.bulletTimer += 1;
                this.bonusTimer +=1;
                this.gameMechanic.draw(this);       
                this.gameMechanic.update(this);
                return;
            }
	        this.context.font = "bold " + this.FONT_SIZE + "px sans-serif"; 
            if(this.stopped)
            {
	            this.context.fillText("Click play" ,this.GAME_WIDTH / 2 - this.FONT_SIZE * 3, this.GAME_HEIGHT / 2);
	            return;
       		}
        	if(this.pauseFlag) {
        		this.context.fillText("Game Paused" ,this.GAME_WIDTH / 2 - this.FONT_SIZE * 3, this.GAME_HEIGHT / 2);
        		return;
        	}
        	if(this.gameover){
        		this.context.fillText("gameover" ,this.GAME_WIDTH / 2 - this.FONT_SIZE * 3, this.GAME_HEIGHT / 2);
        		return;
        	}
        },
 
        endGame: function(){
	            this.asteroidTimer = 0;
                this.bulletTimer = 0;
	            this.player.score = 0;
	            this.player.bonusBullets = [0 , 0];
	            this.player.x = this.PLAYER_START_X;
	            this.player.y = this.PLAYER_START_Y;
	            this.asteroids = [];
	            this.player.bullets = [];
	            this.bangs = [];
	            this.keydown = [];
	            this.gameover = true;
	            this.setBtnText();    
        }
 
    });
     
    return Game;
});
