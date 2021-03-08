/**
 * develop by Jazping
 */

if(typeof Fusion == 'undefined'){
	Fusion = {};
}

Fusion.Material = function(scene){
	this.scene = scene;
	this.mat_ground = new BABYLON.StandardMaterial("mat_ground", scene);
	this.mat_ground.diffuseTexture = new BABYLON.Texture("../../ASSETS/IMAGE/draw2.png", scene);
	this.mat_ground.backFaceCulling = false;
	this.mat_ground.freeze();
	
	
	this.mat_wall = new BABYLON.StandardMaterial("mat_wall", scene);//1
	this.mat_wall.diffuseTexture = new BABYLON.Texture("../../ASSETS/IMAGE/wall.jpg", scene);
	this.mat_wall.backFaceCulling = false;
	this.mat_wall.emissiveTexture = this.mat_wall.diffuseTexture;
	this.mat_wall.opacityTexture = this.mat_wall.diffuseTexture;
	this.mat_wall.specularTexture = this.mat_wall.diffuseTexture;
	this.mat_wall.freeze();
	
	this.mat_outline = new BABYLON.StandardMaterial("mat_outline", scene);//1
	this.mat_outline.diffuseTexture = new BABYLON.Texture("../../ASSETS/IMAGE/outwall.jpg", scene);
	this.mat_outline.backFaceCulling = false;
	this.mat_outline.freeze();
	
	this.mat_net = new BABYLON.StandardMaterial("mat_net", scene);
	this.mat_net.diffuseTexture = new BABYLON.Texture("../../ASSETS/IMAGE/net.png", scene);
	this.mat_net.emissiveTexture = this.mat_net.diffuseTexture;
	this.mat_net.opacityTexture = this.mat_net.diffuseTexture;
	this.mat_net.specularTexture = this.mat_net.diffuseTexture;
	this.mat_net.backFaceCulling = false;
	this.mat_net.diffuseTexture.hasAlpha = true;
	this.mat_net.alpha = 1.0;
	this.mat_net.freeze();
	
	this.mat_ball = new BABYLON.StandardMaterial("mat_ball", scene);
	this.mat_ball.diffuseTexture = new BABYLON.Texture("../../ASSETS/IMAGE/ball2.jpeg", scene);
	this.mat_ball.emissiveTexture = this.mat_ball.diffuseTexture;
	//this.mat_ball.opacityTexture = this.mat_ball.diffuseTexture;
	//this.mat_ball.specularTexture =  this.mat_ball.diffuseTexture;
	this.mat_ball.freeze();
	
	var assetsManager = new BABYLON.AssetsManager(scene);
	
	var binaryTask = assetsManager.addBinaryFileTask(
			  "begin task",
			  "../../SOUNDS/13616.wav"
			);
	binaryTask.onSuccess = function(task) {
		  var begin = new BABYLON.Sound("begin", task.data, scene, function(){
		  }, {
		    loop: false,
		    autoplay: true
		  });
		};
		
		var target = this;
		
		binaryTask = assetsManager.addBinaryFileTask(
				  "bg2 task",
				  "../../SOUNDS/11988.wav"
				);
		
		binaryTask.onSuccess = function(task) {
			target.bg2 = new BABYLON.Sound("bg2", task.data, scene, null, {
			    loop: false
			  });
			target.bg2.onended = onended;
			target.bg2.isEnd = true;
		};
			
			binaryTask = assetsManager.addBinaryFileTask(
					  "bg1 task",
					  "../../SOUNDS/12968.wav"
					);
			
			binaryTask.onSuccess = function(task) {
				target.bg1 = new BABYLON.Sound("bg1", task.data, scene, null, {
				    loop: false
				  });
				};


	
	var onended = function() {
		target.bg2.isEnd = true;
	};
	assetsManager.load();
	this.stopSound = new BABYLON.Sound("Stop", "../../SOUNDS/11116.mp3", scene, function() {
		  // Sound has been downloaded & decoded
		  //music.play();
		});
	this.goalSound = new BABYLON.Sound("Goal", "../../SOUNDS/11030.wav", scene, function() {
		  // Sound has been downloaded & decoded
		  //music.play();
		});
	this.ballSound = new BABYLON.Sound("Ball", "../../SOUNDS/11916.wav", scene, function() {
		  // Sound has been downloaded & decoded
		  //music.play();
		});
};
