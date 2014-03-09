define(['game/objects/object'], 
function(AbstractObject){
	var Bullet = AbstractObject.$extend({
		__init__: function(color, x, y, resources, constSpeed , type){
			this.type = type;
			this.damage = this.type; 
			var radius;
			var resource;
			switch(this.type){
				case 1:
					resource = resources.firstTypeBullet;
					break;
				case 2:
					resource = resources.secondTypeBullet;
					break;
				case 3:
					resource = resources.thirdTypeBullet;
					break;
				default:
					break;
			}		
    		this.initMotion(0 , constSpeed * this.type / 2 );
			this.$super(color, x, y, resource);
		}
	});
	
	return Bullet;
});