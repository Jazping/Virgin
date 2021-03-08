var SceneStarter = function(canvasId,fps,build){
	
	var canvas = document.getElementById(canvasId);
	var divFps = document.getElementById(fps);
	var engine = null;
	var scene = null;
	var sceneToRender = null;
	var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
	var delayCreateScene = function () {
		
		engine.enableOfflineSupport = false;
		BABYLON.Animation.AllowMatricesInterpolation = true;
		var scene = new BABYLON.Scene(engine);
		
		engine.displayLoadingUI();
		var hideLoading = false;
		if(typeof build == 'function'){
			hideLoading = build(scene,engine,canvas);
		}
		if(hideLoading==false||!hideLoading){
			engine.hideLoadingUI();
		}
		return scene;
		
	};
	
	var engine;
	var scene;
	initFunction = async function() {               
		var asyncEngineCreation = async function() {
			try {
				return createDefaultEngine();
			} catch(e) {
				console.log("the available createEngine function failed. Creating the default engine instead");
				return createDefaultEngine();
			}
		}
		
		engine = await asyncEngineCreation();
		if (!engine) throw 'engine should not be null.';
		scene = delayCreateScene();};
		
		initFunction().then(() => {sceneToRender = scene        
			engine.runRenderLoop(function () {
				if (sceneToRender && sceneToRender.activeCamera) {
					sceneToRender.render();
				}
				 if (divFps) {
		                // Fps
		                divFps.innerHTML = engine.getFps().toFixed() + " fps";
		            }
			});
		});
		
		// Resize
		window.addEventListener("resize", function () {
			engine.resize();
		});
		
	this.scene = scene;
	this.engine = engine;
}
