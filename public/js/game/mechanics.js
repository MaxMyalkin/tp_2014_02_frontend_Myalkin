define(['classy',
 'game/objects/asteroid',
 'game/objects/bonus',
 'game/objects/bigBang'
 ], 
function(Class,
 Asteroid,
 Bonus,
 BigBang
 ){

    var GameMechanic = Class.$extend({
        
        deleteObject: function (object, index){
            object.splice(index, 1);
        },

        drawObjects: function (object, gameHeight, context, dx, dy){
            if (dx === undefined){
                dx = 0;
            }
            if (dy === undefined){
                dy = 0;
            }
            for (var i = 0; i < object.length; i++)
            {
                object[i].draw(context, dx, dy);
                if ((object[i].y + object[i].height < 0) 
                    || (object[i].y - object[i].height > gameHeight) || 
                    (object[i].sprite != undefined && object[i].sprite.once && object[i].sprite.wasPlayed))
                {
                    this.deleteObject(object, i); 
                }
            };
        },

        update: function(game){
            if (game.asteroidTimer % 1 === 0)
                this.collisionTest(game);
            if (game.asteroidTimer == game.ASTEROID_TIMEOUT) {
                this.createAsteroid(game);
            }
            if (game.bonusTimer == game.BONUS_TIMEOUT) {
                this.createBonus(game);
            }
         	
            for (var i = 0; i < game.asteroids.length; i++)  
            {
                game.asteroids[i].y += game.asteroids[i].speedY;
                if (this.collision(game.player, game.asteroids[i], 0.95)){
                    game.endGame();
                }
                
            }

            for (var i = 0; i < game.player.bullets.length; i++)
            {
                game.player.bullets[i].y -= game.player.bullets[i].speedY;
            }
            
            for (var i = 0; i < game.bonuses.length; i++)
            {
                game.bonuses[i].time += 1;
            }
            
        },

        collisionTest: function(game){
            var toDeleteAster = [];
            var toDeleteBullet = [];
            var toDeleteBonus = [];
            for (var i = 0; i < game.player.bullets.length; i++)
            {   
                for (var j = 0; j < game.asteroids.length; j++)
                {
                    if (this.collision(game.player.bullets[i], game.asteroids[j])){
                        toDeleteBullet.push(i);
                        if(game.asteroids[j].health <= game.player.bullets[i].damage)
                        {
                            toDeleteAster.push(j);
                            game.bangs.push(new BigBang("#ffffff", game.asteroids[j].x, game.asteroids[j].y, 
                                game.asteroids[j].radius, game.resources.bigBangImg));
                            game.player.score += game.asteroids[j].type;
                            break;
                        }
                        game.asteroids[j].health -= game.player.bullets[i].damage;
                    }
                }
            }

            for( var i = 0; i < game.bonuses.length ; i++)
            {
            	if(this.collision(game.player , game.bonuses[i]))
            	{
            		toDeleteBonus.push(i);
            		game.player.bonusBullets += 5;
            	}
            	else
	            	if(game.bonuses[i].time > game.BONUS_TERMINATE)
	            	{
	            		toDeleteBonus.push(i);
	            	}
            }

            for (var i = 0; i < toDeleteBonus.length; i++) {
                    this.deleteObject(game.bonuses, toDeleteBonus[i]);
            };

            for (var i = 0; i < toDeleteBullet.length; i++) {
                    this.deleteObject(game.player.bullets, toDeleteBullet[i]);
            };
         
            for (var i = 0; i < toDeleteAster.length; i++) {
                    this.deleteObject(game.asteroids, toDeleteAster[i]);
            };
        },

        createAsteroid: function(game){
            game.asteroidTimer = 0;
            var asteroid = new Asteroid("#ffffff", game.GAME_WIDTH, 0 , game.resources, game.ASTEROID_SPEED); 
            game.asteroids.push(asteroid);
            delete asteroid;
        },

        createBonus: function(game){
        	game.bonusTimer = 0;
            var bonus = new Bonus("#ffffff", Math.random() * game.GAME_WIDTH, Math.random() * game.GAME_HEIGHT , game.resources); 
            game.bonuses.push(bonus);
        },

        collision: function(object1, object2, percent){
            if (percent === undefined){
                percent = 1;
            }
            if(Math.sqrt(Math.pow(object2.x - object1.x , 2) + Math.pow( object2.y - object1.y , 2) ) < (object1.radius + object2.radius) * percent ) {
                return true;
            }
            else   {
                return false;
            }
        }
    });

    return GameMechanic;
});