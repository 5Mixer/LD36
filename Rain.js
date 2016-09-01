var Rain = function (){
	this.particles = [];
	this.enabled = false;
	this.amount = 0.0;
}
Rain.prototype.draw = function(c){

	var i = this.particles.length;
	while(i--){
		this.particles[i].draw(c);

		if (this.particles[i].y > height){
			this.particles.splice(i,1);
		}
	}

	if (this.enabled){
		if (this.amount < 1) this.amount += 0.01;
		this.particles.push(new RainParticle(Math.random()*400));

	}else{
		if (this.amount > 0) this.amount -= 0.01;
	}

	c.fillStyle = "rgba(69, 69, 69,"+this.amount*.4+")"
	c.fillRect(0,0,width,height);
}

var rainImg = new Image();
rainImg.src = "assets/RainParticle.png";

var RainParticle = function(x){
	this.x = x;
	this.y = -5;
	this.vy = 7 + Math.floor(Math.random()*3);
}
RainParticle.prototype.draw = function (c){
	this.y += this.vy;

	c.drawImage(rainImg, 0,0,8,8, this.x, this.y, 16,16);

}
