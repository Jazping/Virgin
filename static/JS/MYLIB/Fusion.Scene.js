/**
 * develop by Jazping
 */
if(typeof Fusion == 'undefined'){
	Fusion = {};
}
Fusion.Scene = function(material,scene,canvas,playSpeed){
	var worldLight;
	var sunLight;
	var createLighting = function(){
		worldLight = new BABYLON.DirectionalLight("light0", new BABYLON.Vector3(-1, -2, 1), scene);
		worldLight.diffuse = new BABYLON.Color3(255,242,200);
		worldLight.specular = new BABYLON.Color3(0,0,0);
		//worldLight.groundColor = new BABYLON.Color3(0,0,0);
		worldLight.position = new BABYLON.Vector3(-50, 120, -180);
		worldLight.intensity = 0.5;
		worldLight.setEnabled(false);
		
		sunLight = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-1, -2, 1), scene);
		sunLight.diffuse = new BABYLON.Color3(255,242,200);
		sunLight.specular = new BABYLON.Color3(0,0,0);
		//sunLight.groundColor = new BABYLON.Color3(0,0,0);
		sunLight.intensity = 0.5;
		sunLight.position = new BABYLON.Vector3(50, 120, -180);
//		sunLight.setEnabled(false);
	}
	
	var createShadows = function(light,torus){
		var shadowGenerator = new BABYLON.ShadowGenerator(512, light);
		shadowGenerator.getShadowMap().renderList.push(torus);
		shadowGenerator.useBlurExponentialShadowMap = true;
	    shadowGenerator.useKernelBlur = true;
	    shadowGenerator.blurKernel = 64;
	    shadowGenerator.lambda = 0.2;
	}
	var createFollowCamera = function(targetMesh,canvas){
    	// Parameters: name, position, scene
    	var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 30, 0), scene);
    	// The goal distance of camera from target
    	camera.radius = 30;
    	// The goal height of camera above local origin (center) of target
    	camera.heightOffset = 20;
    	// The goal rotation of camera around local origin (center) of target in x y plane
    	camera.rotationOffset = 0;
    	// Acceleration of camera in moving from current to goal position
    	camera.cameraAcceleration = 0.005;
    	// The speed at which acceleration is halted
    	camera.maxCameraSpeed = 15;
    	// This attaches the camera to the canvas
    	camera.lockedTarget = targetMesh; //version 2.5 onwards
    	return camera;
    };
    
    var createUniverseCamera = function(canvas){
       var camera0 = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(50, 220, 0), scene);
       camera0.setTarget(new BABYLON.Vector3(5, 0, 0));
       camera0.wheelDeltaPercentage = 0.01;
       camera0.upperBetaLimit = 1.75; 
       return camera0;
   };

   var buildWall = function(name,mat_stone,position,rotation,scene,opts){
  	 var wall = BABYLON.MeshBuilder.CreatePlane(name, opts, scene); 
       wall.sideOrientation=BABYLON.Mesh.DOUBLESIDE;
       wall.position  = position;
       wall.material= mat_stone;
       wall.rotation = rotation;
       wall.renderingGroupId=2; 
   };
   
   var buildGate = function(name,mat_stone,position,rotation,scene,reverse,lines){
	   	var mat = mat_stone.clone();
		//mat.diffuseTexture.uScale = 5;//Repeat 5 times on the Vertical Axes
	    //mat.diffuseTexture.vScale = 5;//Repeat 5 times on the Horizontal Axes
	    //mat.diffuseTexture.vOffset = 0.4;//Vertical offset of 10%
	    //mat.diffuseTexture.uOffset = 0.4;//Horizontal offset of 40%
	    //mat.diffuseTexture.uRotationCenter = 0.5;
	    //mat.diffuseTexture.vRotationCenter = 0.5;
	    var w = 7.3*2;
	    var h = 2.45*2;
		var y = h;
		var opts = {height:h,width:h,backUVs:[new BABYLON.Vector4(0.5,0.5,1,1)]};
		var eged = BABYLON.MeshBuilder.CreatePlane(name, opts, scene);
		eged.position = position.clone();
		eged.position.y = h/2;
		eged.position.x = (!reverse?w/2:-w/2);
		eged.position.z = eged.position.z+(!reverse?h/2:-h/2);
		eged.material= mat;
		eged.renderingGroupId=2; 
		eged.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
		
		eged = BABYLON.MeshBuilder.CreatePlane(name, {height:h,width:h}, scene);
		eged.position = position.clone();
		eged.position.y = h/2;
		eged.position.x = (!reverse?-w/2:w/2);
		eged.position.z = eged.position.z+(!reverse?h/2:-h/2);
		eged.material= mat;
		eged.renderingGroupId=2; 
		eged.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
		
		var root = BABYLON.MeshBuilder.CreatePlane(name, {height:w,width:h}, scene); 
		root.sideOrientation=BABYLON.Mesh.DOUBLESIDE;
		root.position  = position.clone();
		root.position.y  = y;
		root.position.z = root.position.z + (!reverse?h/2:-h/2);
		root.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 2, 0);
		root.material= mat;
		root.renderingGroupId=2; 
		
		var deepth = BABYLON.MeshBuilder.CreatePlane(name, {height:h,width:w}, scene); 
		deepth.sideOrientation=BABYLON.Mesh.DOUBLESIDE;
		deepth.position  = position.clone();
		deepth.position.y = h/2;
		deepth.position.z = eged.position.z+(!reverse?h/2:-h/2);
		deepth.material= mat_stone;
		deepth.rotation = rotation;
		deepth.renderingGroupId=2; 
		
		var count = 1;
		var name = lines+(!reverse?count++:count--);
		var mat = new BABYLON.StandardMaterial("mat_b", scene);
	    mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
	    mat.backFaceCulling = false;
	    mat.emissiveColor = mat.diffuseColor;
	    mat.opacityColor = mat.diffuseColor;
	    mat.specularColor =  mat.diffuseColor;
	    mat.freeze();
	    
	    var diameter = 2*0.11;
		var mesh=BABYLON.MeshBuilder.CreateCylinder(name,{height:w+diameter,diameter:diameter},scene);
		mesh.sideOrientation=BABYLON.Mesh.DOUBLESIDE;
	    mesh.material=mat;
	    mesh.position = new BABYLON.Vector3(0, y, position.z); 
	    mesh.rotation = new BABYLON.Vector3(0, 0, Math.PI / 2); 
	    mesh.renderingGroupId=2; 
	    name = name+(!reverse?count++:count--);
	    mesh=BABYLON.MeshBuilder.CreateCylinder(name,{height:h,diameter:diameter},scene);
		mesh.sideOrientation=BABYLON.Mesh.DOUBLESIDE;
	    mesh.material=mat;
	    mesh.position = new BABYLON.Vector3((!reverse?w/2:-w/2), y/2, position.z); 
	    mesh.rotation = new BABYLON.Vector3(0,  Math.PI / 2,0); 
	    mesh.renderingGroupId=2; 
	    name = name+(!reverse?count++:count--);
	    mesh=BABYLON.MeshBuilder.CreateCylinder(name,{height:h,diameter:diameter},scene);
		mesh.sideOrientation=BABYLON.Mesh.DOUBLESIDE;
	    mesh.material=mat;
	    mesh.position = new BABYLON.Vector3((!reverse?-w/2:w/2), y/2, position.z); 
	    mesh.rotation = new BABYLON.Vector3(0,  Math.PI / 2,0); 
	    mesh.renderingGroupId=2; 
	    
	};
	
	var createPlayer = function(position,reverse){
		var mat = new BABYLON.StandardMaterial("mat_b", scene);
	    mat.diffuseColor = !reverse?new BABYLON.Color3(1, 0, 0,1):new BABYLON.Color3(0, 0, 1,1);
	    mat.backFaceCulling = false;
	    mat.emissiveColor = mat.diffuseColor;
	    mat.freeze();
//	    var man = BABYLON.MeshBuilder.CreateCylinder(name,{height:2*1.7,diameter:0.4*2},scene);
//	    man.material=mat;
//	    man.position = new BABYLON.Vector3(position.x, 1.7, position.z); 
//	    man.rotation = new BABYLON.Vector3(0,  Math.PI / 2,0); 
//	    man.renderingGroupId=2; 
	    
	    var man = scorers[0].clone();
	    var skeleton = scorers[0].skeleton.clone();
	    man.material = mat;
	    man.serverId = position.id;
	    man.position = new BABYLON.Vector3(position.x, 0, position.z); 
	    //man.rotation = !reverse?new BABYLON.Vector3(0,Math.PI,0):new BABYLON.Vector3(0,0,0); 
	    man.rotation = !reverse?new BABYLON.Vector3(0,position.eye,0):new BABYLON.Vector3(0,position.eye,0); 
	    man.renderingGroupId = 2;
	    skeleton.target = man;
	    man.skeleton = skeleton;
	    man.orgRotation = man.rotation ;
	    man.walkAnim = scene.beginAnimation(skeleton, 90, 118, false);
	    man.idleAnim = scene.beginAnimation(skeleton, 0, 89, false);
	    man.runAnim = scene.beginAnimation(skeleton, 119, 135, true);
	    
//	    man.walkAnim.stop(); man.runAnim.stop();
	    man.action = "RUN";
	    
	    var label = new BABYLON.GUI.Rectangle(position.id);
        label.height = "30px";
        label.width = "200px";
        label.cornerRadius = 20;
        label.thickness = 0;
        label.fontSize = 14;
        label.linkOffsetY = -40;
        label.linkOffsetZ = -40;
        screenUI.addControl(label);
        label.linkWithMesh(man);
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = position.name;
        text1.color = "white";
        label.addControl(text1);
        label.isVisible=false;
        man.label = label;
	    return man;
	}
	
	var screenUI=BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("screenUI");
	
	var createBall = function(name,mat_stone,position,rotation,scene){
    	var opt = {diameter:2*0.22};
    	var sphere = BABYLON.MeshBuilder.CreateSphere(name, opt, scene);
		//var opt = {size:2*0.22};
		//var sphere = BABYLON.MeshBuilder.CreateBox(name, opt, scene);
    	sphere.sideOrientation=BABYLON.Mesh.DOUBLESIDE;
    	sphere.position  = position;
    	sphere.material= mat_stone;
    	sphere.rotation = rotation;
    	sphere.serverId = "ball";
    	sphere.renderingGroupId=2; 
    	
    	 //Create a scaling animation at 10 FPS
        var frameRate = 10;
        var slideY = new BABYLON.Animation("yAnimation", "position.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var slideZ = new BABYLON.Animation("zAnimation", "position.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        //var rotationX = new BABYLON.Animation("rxAnimation", "rotation.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                //BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var rotationZ = new BABYLON.Animation("rzAnimation", "rotation.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        //var rotationY = new BABYLON.Animation("ryAnimation", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                //BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var slides = slideKeys(frameRate);
        var rotations = rotationKeys(frameRate);
        slideY.setKeys(slides.v);
        slideZ.setKeys(slides.h);
        //rotationX.setKeys(rotations);
        rotationZ.setKeys(rotations);
        //rotationY.setKeys(rotations);
        
        //sphere.animations.push(scalingX);
        //sphere.animations.push(scalingY);
        //sphere.animations.push(slideZ);
        //sphere.animations.push(slideY);
        //sphere.animations.push(rotationZ);
        //sphere.animations.push(rotationY);
        //sphere.animations.push(rotationX);
    	sphere.testAnimation = [slideZ,slideY,rotationZ];
        return sphere;
    }
	
	var rotationKeys = function(frameRate){
    	var keys = [];
    	keys.push({
            frame: 0,
            value: 0
        });
    	keys.push({
            frame: frameRate,
            value: 4*Math.PI
        });
    	keys.push({
            frame: 2*frameRate,
            value: 8*Math.PI
        });
    	keys.push({
            frame: 3*frameRate,
            value: 12*Math.PI
        });
    	keys.push({
            frame: 4*frameRate,
            value: 16*Math.PI
        });
    	keys.push({
            frame: 5*frameRate,
            value: 20*Math.PI
        });
    	keys.push({
            frame: 6*frameRate,
            value: 24*Math.PI
        });
    	keys.push({
            frame: 7*frameRate,
            value: 28*Math.PI
        });
    	keys.push({
            frame: 8*frameRate,
            value: 32*Math.PI
        });
    	keys.push({
            frame: 9*frameRate,
            value: 36*Math.PI
        });
    	return keys;
    };
    
    var slideKeys = function(frameRate){
    	// Animation keys
        var keys = [];
    	var vkeys = [];
    	var c = 0;
    	var radian = 45*Math.PI/180;
        var G = 9.81;
        var v = 30+2;
        var r = 2*0.11;
        //At the animation key 0, the value of scaling is "1"
        keys.push({
            frame: 0,
            value: c
        });
        vkeys.push({
        	frame: 0,
        	value: Math.max(r,c*Math.tan(radian)-(G*Math.pow(c,2)/(2*Math.pow((v*Math.cos(radian)), 2))))
        });
        //At the animation key 20, the value of scaling is "0.2"
        c = c+30;
        keys.push({
            frame: frameRate,
            value: c
        });
        vkeys.push({
        	frame: frameRate,
        	value: Math.max(r,c*Math.tan(radian)-(G*Math.pow(c,2)/(2*Math.pow((v*Math.cos(radian)), 2))))
        });
        //At the animation key 100, the value of scaling is "1"
        c = c+30;
        keys.push({
            frame: 2*frameRate,
            value: c
        });
        vkeys.push({
        	frame: 2*frameRate,
        	value: Math.max(r,c*Math.tan(radian)-(G*Math.pow(c,2)/(2*Math.pow((v*Math.cos(radian)), 2))))
        });
        //
        c = c+30;
        keys.push({
            frame: 3*frameRate,
            value: c
        });
        vkeys.push({
        	frame: 3*frameRate,
        	value: Math.max(r,c*Math.tan(radian)-(G*Math.pow(c,2)/(2*Math.pow((v*Math.cos(radian)), 2))))
        });
        //
        c = c+35;
        keys.push({
            frame: 4*frameRate,
            value: c
        });
        vkeys.push({
        	frame: 4*frameRate,
        	value: Math.max(r,c*Math.tan(radian)-(G*Math.pow(c,2)/(2*Math.pow((v*Math.cos(radian)), 2))))
        });
        //
        c = c-30;
        keys.push({
            frame: 5*frameRate,
            value: c
        });
        vkeys.push({
        	frame: 5*frameRate,
        	value: Math.max(r,c*Math.tan(radian)-(G*Math.pow(c,2)/(2*Math.pow((v*Math.cos(radian)), 2))))
        }); 
        //
        c = c-30;
        keys.push({
            frame: 6*frameRate,
            value: c
        });
        vkeys.push({
        	frame: 6*frameRate,
        	value: Math.max(r,c*Math.tan(radian)-(G*Math.pow(c,2)/(2*Math.pow((v*Math.cos(radian)), 2))))
        }); 
        //
        c = c-35;
        keys.push({
            frame: 7*frameRate,
            value: c
        });
        vkeys.push({
        	frame: 7*frameRate,
        	value: Math.max(r,c*Math.tan(radian)-(G*Math.pow(c,2)/(2*Math.pow((v*Math.cos(radian)), 2))))
        }); 
        //
        c = c-30;
        keys.push({
            frame: 8*frameRate,
            value: c
        });
        vkeys.push({
        	frame: 8*frameRate,
        	value: Math.max(r,c*Math.tan(radian)-(G*Math.pow(c,2)/(2*Math.pow((v*Math.cos(radian)), 2))))
        }); 
    	var move = {h:keys,v:vkeys};
        return move;
    }
    
    createLighting();
    
//    var ground = BABYLON.MeshBuilder.CreatePlane("ground", {width:400,height:260}, scene); 
    var ground = BABYLON.MeshBuilder.CreatePlane("ground", {width:490,height:245}, scene); 
    ground.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
    ground.material = material.mat_ground;
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 2, 0);
    ground.renderingGroupId=2; 
    ground.receiveShadows = true;
    
    var wallopts = {height:30,width:490};
    var outopts = {height:80,width:490};
    var mat_stone = material.mat_wall;
    var mat_outwall = material.mat_outline;
    buildWall("wall-1",mat_stone,new BABYLON.Vector3(130, 5, 0),new BABYLON.Vector3(Math.PI / 4, Math.PI / 2, 0),scene,wallopts);
    buildWall("outwall-1",mat_outwall,new BABYLON.Vector3(160, 30, 0),new BABYLON.Vector3(Math.PI / 4, Math.PI / 2, 0),scene,outopts);
    buildWall("wall-2",mat_stone,new BABYLON.Vector3(-130, 5, 0),new BABYLON.Vector3(Math.PI*3/4, Math.PI / 2, Math.PI),scene,wallopts);
    buildWall("outwall-2",mat_outwall,new BABYLON.Vector3(-160, 30, 0),new BABYLON.Vector3(Math.PI*3/4, Math.PI / 2, Math.PI),scene,outopts);
    buildWall("wall-3",mat_stone,new BABYLON.Vector3(0, 5, 250),new BABYLON.Vector3(Math.PI/4, 0, 0),scene,wallopts);
    buildWall("outwall-3",mat_outwall,new BABYLON.Vector3(0, 30, 300),new BABYLON.Vector3(Math.PI/4, 0, 0),scene,outopts);
    buildWall("wall-4",mat_stone,new BABYLON.Vector3(0, 5, -250),new BABYLON.Vector3(Math.PI*3/4, 0, Math.PI),scene,wallopts);
    buildWall("outwall-4",mat_outwall,new BABYLON.Vector3(0, 30, -300),new BABYLON.Vector3(Math.PI*3/4, 0, Math.PI),scene,outopts);
    
    var mat_white_line = material.mat_net;
    buildGate("Gate-1",mat_white_line,new BABYLON.Vector3(0, 0, 120),new BABYLON.Vector3(0, 0, 0),scene,false,"left");
    buildGate("Gate-2",mat_white_line,new BABYLON.Vector3(0, 0, -120),new BABYLON.Vector3(0, 0, 0),scene,true,"right");
    
    var mat_white = material.mat_ball;
    var ball = createBall("Ball",mat_white,new BABYLON.Vector3(0, 2*0.11, 0),new BABYLON.Vector3(Math.PI/2, Math.PI / 2, 0),scene,function(){
    	scene.freeCam.attachControl(canvas, true);
    	scene.activeCameras.push(scene.freeCam);
    });
    scene.freeCam = createUniverseCamera(canvas);
    scene.followCam = createFollowCamera(ball,canvas);
    scene.activeCameras.push(scene.followCam);
    
    createShadows(sunLight,ball);
    //createShadows(worldLight,ball);
    
    
    var label = new BABYLON.GUI.Rectangle("SKILLING");
    label.height = "30px";
    label.width = "400px";
    label.cornerRadius = 20;
    label.thickness = 0;
    label.alpha = 0.5;
    label.background = "black";
    label.fontSize = 14;
    label.linkOffsetY = -100;
    label.linkOffsetZ = -40;
    screenUI.addControl(label);
    var text1 = new BABYLON.GUI.TextBlock();
    text1.color = "yellow";
    label.addControl(text1);
    label.isVisible=false;
    label.text = text1;
    this.switchFollowCamera = function(){
    	scene.activeCameras.push(scene.followCam);
    };
    
    this.switchFreeCamera = function(){
    	scene.freeCam.attachControl(canvas, true);
    	scene.activeCameras.push(scene.freeCam);
    };
    
    this.testAnimation = function(repeat,callback){
    	scene.beginDirectAnimation(ball,ball.testAnimation, 0, 8 * 10, repeat,1,callback);
    };
    
    this.updatePosition = function(position,onFinished){
    	if(typeof position.id == 'undefined'){
    		console.error("target missing id property");
    		return;
    	}
    	if(typeof targets[position.id] == 'undefined'){
    		var t = createPlayer(position,position.name.indexOf("[L]")!=-1);
    		var target = new ManTarget(playSpeed,t,scene,this);
    		targets[position.id] = target;
    		t.serverId = position.id;
    	}else{
    		targets[position.id].putPosition(position);
    	}
    };
    
    Fusion.Scene.computeDistance = function(x1,y1,x2,y2){
    	var powX = Math.pow(x1-x2, 2);
		var powY = Math.pow(y1-y2, 2);
		return Math.sqrt(powX+powY);
    };
    
    var gloable = 0;
    
    var playRate = 160;
    var frame = 16;
    var BallTarget = function(speed,target,scene,fusionScene){
    	 var queue = [];
    	 var runing = false;
    	 var speed = speed;
    	 var pre = null;
    	 var animation = null;
    	 var target = target;
    	 var fusionScene = fusionScene;
    	 var scene = scene;
    	 var move = new BABYLON.Animation(
				  "move",
				  "position",
				  playRate,
				  BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
				  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
				);
    	 var rot = new BABYLON.Animation(
				  "rot",
				  "rotation",
				  playRate,
				  BABYLON.Animation.ANIMATIONTYPE_VECTOR3, 
				  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
				);
    	 this.putPosition = function(position){
    		var vect = position;
	    	var keys = [];
	    	if(pre==null){
	    		keys.push({frame:0,value:vect,action:position.action});
	    	}else{
	    		var f = pre;
	    		var dx = vect.x - f.x;
	    		var dy = vect.y - f.y;
	    		var dz = vect.z - f.z;
	    		for(var i=0;i<frame;i++){
	    			var x = f.x + (i+1)*dx/frame;
	    			var y = f.y + (i+1)*dy/frame;
	    			var z = f.z + (i+1)*dz/frame;
	    			y = Math.max(2*0.11,y);
	    			var v = new BABYLON.Vector3(x, y, z);
	    			if(i==0){
	    				keys.push({frame:i,value:v,action:position.action});
	    			}else{
	    				keys.push({frame:i,value:v});
	    			}
	    		}
	    	}
	    	queue.push(keys);
	    	pre = vect;
	    	if(gloable==0&&queue.length>1){
	    		doAnimate();
	    	}
    	 };
    	 
    	 var resetFollowCam = function(){
    	    scene.followCam.position = new BABYLON.Vector3(0, 30, 0);
    	 };
    	 
    	 this.shift = function(){
    		 return queue.length==0?null:queue.shift();
    	 };
    	 
    	 var animations = function(keys){
 	    	move.setKeys(keys);
 	    	var rotKeys = [];
 	    	var sp = keys.length;
 	    	for(var i=0;i<sp;i++){
 	    		var value = new BABYLON.Vector3(Math.PI/8, 0, Math.PI/8);
 	    		if(i>0){
 	    			var current = keys[i].value;
 	    			var last = keys[i-1].value;
 	    			var d = Fusion.Scene.computeDistance(current.x,current.z,last.x,last.z);
 	    			var relateZ = current.z - last.z;
 	    			var relateX = current.x - last.x;
 	    			var arcZ = d==0?0:-relateX/d;
 	    			var arcX = d==0?0:relateZ/d;
 	    			var relateY = current.y - last.y;
 	    			relateX = current.x - last.x;
 	    			var arcY = d==0?0:relateY/d;
 	    			var arcY = 0;//BUG
 	    			//arcZ = 0;
 	    			var r = rotKeys[i-1];
 	    			value = new BABYLON.Vector3(r.value.x+arcX/8, r.value.y+arcY/8, r.value.z+arcZ/8);
 	    		}
 	    		rotKeys.push({frame:keys[i].frame,value:value});
 	    	}
 	    	rot.setKeys(rotKeys);
 	    	if(keys[0].action=="KICK"){
 	    		material.ballSound.play();
 	    	}else if(keys[0].action=="RISEUP"&&material.bg2&&material.bg2.isEnd==true){
 	    		material.bg2.isEnd = false;
 	    		material.bg2.play();
 	    	}
 	    	return [move,rot];
    	 };
    	 
    	 var onEnd = function(){
    		var zTure = Math.abs(target.position.z)>60*2;
			var xTure = Math.abs(target.position.x)<3.5*2;
			var yTure = Math.abs(target.position.y)<2.44*2;
			if(zTure==true&&xTure==true&&yTure==true){
				label.text.text = "Goal!!!";
 	    		label.linkWithMesh(ball);
 	    		label.isVisible = true;
				gloable = 4000;
				material.stopSound.play();
				material.goalSound.play();
				setTimeout(function(){
					target.position = new BABYLON.Vector3(0, 2*0.11, 0);
					resetFollowCam();
					runing = false;
					label.isVisible = false;
					gloable = 0;
					material.stopSound.play();
					doAnimate();
				},gloable);
			}else if(zTure==true){
				label.text.text = "球门球或角球 !";
 	    		label.linkWithMesh(ball);
 	    		label.isVisible = true;
				gloable = 2000;
				material.stopSound.play();
				setTimeout(function(){
					gloable = 0;
					runing = false;
					label.isVisible = false;
					material.stopSound.play();
					doAnimate();
				},gloable);
			}else if(zTure==false&&Math.abs(target.position.x)>45*2){
				label.text.text = "边界球 !";
 	    		label.linkWithMesh(ball);
 	    		label.isVisible = true;
				gloable = 2000;
				material.stopSound.play();
				setTimeout(function(){
					gloable = 0;
					runing = false;
					label.isVisible = false;
					material.stopSound.play();
					doAnimate();
				},gloable);
			}else{
				doAnimate();
			}
    	 };
    	 
    	 var getTarget = function(){
    		return  target;
    	 };
    	 
    	 var doAnimate = function(){
    		 for(var k in targets){
    			 if(targets[k]!=this){
    				 targets[k].doAnimate();
    			 }
    		 }
    		 doAnimation();
    	 };
    	 
    	 var doAnimation = function(){
    		if(runing==true){
      			return;
      		}else if(queue.length==0){
      			return;
      		}
      		runing = true;
      		var keys = queue.shift();
      		if(keys!=null&&keys!=undefined&&keys.length>0){
      			var anims = animations(keys);
      			var min = keys[keys.length-1].frame;
      			scene.beginDirectAnimation(getTarget(),anims, 0, min,false,1,function(){
      				runing = false;
      				onEnd();
      			});
      		}
      	};
      	
      	this.doAnimate = doAnimate;
    };
    
    var ManTarget = function(speed,target,scene,fusionScene){
    	 var queue = [];
	   	 var speed = speed;
	   	 var pre = null;
	   	 var target = target;
	   	 var fusionScene = fusionScene;
	   	 var scene = scene;
	   	 var runing = false;
	    var move = new BABYLON.Animation(
		  "move",
		  "position",
		  playRate,
		  BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
		  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
		);
	    var rot = new BABYLON.Animation(
				  "rot",
				  "rotation",
				  playRate,
				  BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
				  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
				);
	   	 this.putPosition = function(position){
	   		var vect = position;
	    	var keys = [];
	    	if(pre==null){
	    		keys.push({frame:0,value:vect,eye:position.eye,action:position.action});
	    	}else{
	    		var f = pre;
    			var dx = vect.x - f.x;
    			var dy = vect.y - f.y;
    			var dz = vect.z - f.z;
    			for(var i=0;i<frame;i++){
    				var x = f.x + (i+1)*dx/frame;
    				var y = f.y + (i+1)*dy/frame;
    				var z = f.z + (i+1)*dz/frame;
    				y = 0;
    				var v = new BABYLON.Vector3(x, y, z);
    				if(i==0){
    					keys.push({frame:i,value:v,eye:position.eye,action:position.action});
    				}else{
    					keys.push({frame:i,value:v});
    				}
    			}
	    	}
	    	queue.push(keys);
	    	pre = vect;
	    };
	    
    	 this.shift = function(){
    		 return queue.length==0?null:queue.shift();
    	 };
    	 
    	 var animations = function(keys){
 	    	move.setKeys(keys);
 	    	//var anims = scene.beginAnimation(target.skeleton, 119, 135, false).getAnimations();
 	    	//anims.push(move);
 	    	var anims = [move];
 	    	var sin = target.rotation.y;
 	    	if(!isNaN(keys[0].eye)){
// 	    		sin = keys[0].eye;
 	    		var subract = keys[0].eye - sin;
 	    		var rotKeys = [];
 	    		var c = playRate;
 	    		for(var i=1;i<=c;i++){
 	    			rotKeys.push({frame:i-1,value:new BABYLON.Vector3(target.rotation.x, sin+subract*(i/c), target.rotation.z)});
 	    		}
 	    		rot.setKeys(rotKeys);
 	    		anims.push(rot);
 	    	}
// 	    	if(!isNaN(sin)){
// 	    		rot.setKeys([{frame:0,value:new BABYLON.Vector3(target.rotation.x, sin, target.rotation.z)}]);
// 	    		anims.push(rot);
// 	    	}
 	    	
 	    	if(keys[0].action!='null'&&keys[0].action!=null&&keys[0].action.indexOf('[')!=-1){
 	    		var act = keys[0].action;
 	    		if(act!=target.action&&act=="[RUN]"){
// 	    			target.action = act;
// 	    			target.walkAnim.stop(); target.runAnim.stop();
// 	    			target.runAnim = scene.beginAnimation(target.skeleton, 119, 135, true);
// 	    			anims.push(target.runAnim.getAnimations()[0].animation);
 	    			//console.log(target.runAnim.getAnimations()[0].animation);
 	    		}else if(act!=target.action&&act=="[WALK]"){
// 	    			anims.push(target.walkAnim.getAnimations()[0].animation);
 	    			//console.log(target.walkAnim.getAnimations()[0].animation);
 	    		}
 	    	}
 	    	else if(keys[0].action!='null'&&keys[0].action!=null&&keys[0].action.indexOf('[')==-1){
 	    		label.text.text = keys[0].action;
 	    		label.linkWithMesh(ball);
 	    		label.isVisible = true;
 	    		setTimeout(function(){label.isVisible=false},2000);
 	    	}
 	    	return anims;
    	 };
    	 
    	 var onEnd = function(){
    		 if(Math.abs(target.position.z)>100){
				 target.rotation = target.orgRotation;
			 }
    	 };
    	 
    	 var getTarget = function(){
    		return  target;
    	 };
    	 
    	 var doAnimate = function(){
    		 doAnimation();
    	 }
    	 
    	 var doAnimation = function(){
    		 if(runing==true){
       			return;
       		}else if(queue.length==0){
       			return;
       		}
     		runing = true;
     		var keys = queue.shift();
     		if(keys!=null&&keys!=undefined&&keys.length>0){
     			var anims = animations(keys);
     			var min = keys[keys.length-1].frame;
     			scene.beginDirectAnimation(getTarget(),anims, 0, min,false,1,function(){
     				runing = false;
     				onEnd();
     			});
     			
//     			if(keys[0].action!='null'&&keys[0].action!=null&&keys[0].action.indexOf('[')!=-1){
//     	    		var act = keys[0].action;
//     	    		if(act!=target.action&&act=="[RUN]"){
//     	    			target.action = act;
//     	    			target.walkAnim.stop(); target.runAnim.stop();
//     	    			target.runAnim = scene.beginAnimation(target.skeleton, 119, 135, true);
//     	    		}else if(act!=target.action&&act=="[WALK]"){
//     	    			target.action = act;
//     	    			target.walkAnim.stop(); target.runAnim.stop();
//     	    			target.walkAnim = scene.beginAnimation(target.skeleton, 90, 118, true);
//     	    		}
//     	    	}
//     	    	else if(keys[0].action!='null'&&keys[0].action!=null&&keys[0].action.indexOf('[')==-1){
//     	    		label.text.text = keys[0].action;
//     	    		label.linkWithMesh(ball);
//     	    		label.isVisible = true;
//     	    		setTimeout(function(){label.isVisible=false},2000);
//     	    	}
     		}
     		var t = getTarget();
     		var d = Fusion.Scene.computeDistance(t.position.x,t.position.z,ball.position.x,ball.position.z);
     		t.label.isVisible = d<2*5;
     	};
     	
     	this.doAnimate = doAnimate;
    };
    
    var ballTarget = new BallTarget(playSpeed,ball,scene,this);
    ball.serverId = "ball";
    var targets = {ball:ballTarget};
} 