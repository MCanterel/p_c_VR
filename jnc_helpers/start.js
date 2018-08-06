// init info and globals source code

var clock = new THREE.Clock();

var container;
var camera;
var scene, raycaster, controlRaycaster,renderer;

var room;
var aerodrome;
var rmSize = 10;
var isMouseDown = false;
var planeCount = 12;

var obstacleCount = 20;

var INTERSECTED;
var PLANE_INTERSECTED;
var crosshair;

var fontLoader;
var textMesh;
var score = 0;
var myfont = null;
var scoreboardMesh;
var scoreboard;

function buildScoreboard(font) {
	scoreboard = new THREE.Object3D();

	var textMaterial = new THREE.MeshLambertMaterial({
		color: 0xcecd21
	});

	var titleGeometry = new THREE.TextGeometry("Hit count:", {
		font: font,
		size: .12,
		height: .1,
		curveSegments: 16,
	});

	var titleMesh = new THREE.Mesh(titleGeometry, textMaterial);
	titleMesh.position.x = -0.32;
	titleMesh.position.y = 0.35;
	titleMesh.position.z = 0.1;
	scoreboard.add(titleMesh);
	var textGeometry = new THREE.TextGeometry(score.toString(), {
		font: font,
		size: .5,
		height: .1,
		curveSegments: 16,
	});

	textMesh = new THREE.Mesh(textGeometry, textMaterial);
	textMesh.position.x = -0.2;
	textMesh.position.y = -0.25;
	textMesh.position.z = 0.2;
	scoreboard.add(textMesh);

	var scoreboardGeometry = new THREE.BoxGeometry(1, 1, .25);
	var scoreboardMaterial = new THREE.MeshLambertMaterial({
		color: 0x19389d
	});
	scoreboardMesh = new THREE.Mesh(scoreboardGeometry, scoreboardMaterial);
	scoreboard.add(scoreboardMesh);

	scoreboard.position.x = 4.65;
	scoreboard.position.y = -0.3;
	scoreboard.position.z = 0.2;
	scoreboard.rotation.y = Math.PI * 1.5;

	scene.add(scoreboard);
}

function onMouseDown() {
	isMouseDown = true;
}

function onMouseUp() {
	isMouseDown = false;
}

function onPointerRestricted() {
	var pointerLockElement = renderer.domElement;
	if (pointerLockElement && typeof (pointerLockElement.requestPointerLock) === 'function') {
		pointerLockElement.requestPointerLock();
	}
}

function onPointerUnrestricted() {
	var currentPointerLockElement = document.pointerLockElement;
	var expectedPointerLockElement = renderer.domElement;
	if (currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof (document.exitPointerLock) ===
		'function') {
		document.exitPointerLock();
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}


function init() {

	container = document.createElement('div');
	document.body.appendChild(container);
	
	var info = document.createElement('div');
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.fontSize = '1.2em';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> jnc - cubes and planes';
	container.appendChild(info);

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.vr.enabled = true;
	container.appendChild(renderer.domElement);

	renderer.domElement.addEventListener('mousedown', onMouseDown, false);
	renderer.domElement.addEventListener('mouseup', onMouseUp, false);
	renderer.domElement.addEventListener('touchstart', onMouseDown, false);
	renderer.domElement.addEventListener('touchend', onMouseUp, false);

	window.addEventListener('resize', onWindowResize, false);

	window.addEventListener('vrdisplaypointerrestricted', onPointerRestricted, false);
	window.addEventListener('vrdisplaypointerunrestricted', onPointerUnrestricted, false);


//  Check this out: When THREE.VRController finds a new controller
//  it will emit a custom “vr controller connected” event on the
//  global window object. It uses this to pass you the controller
//  instance and from there you do what you want with it.

window.addEventListener( 'vr controller connected', function( event ){

	//  Here it is, your VR controller instance.
	//  It’s really a THREE.Object3D so you can just add it to your scene:

	var controller = event.detail
	scene.add( controller )

	//  HEY HEY HEY! This is important. You need to make sure you do this.
	//  For standing experiences (not seated) we need to set the standingMatrix
	//  otherwise you’ll wonder why your controller appears on the floor
	//  instead of in your hands! And for seated experiences this will have no
	//  effect, so safe to do either way:

	controller.standingMatrix = renderer.vr.getStandingMatrix()


	//  And for 3DOF (seated) controllers you need to set the controller.head
	//  to reference your camera. That way we can make an educated guess where
	//  your hand ought to appear based on the camera’s rotation.

	controller.head = window.camera


	//  Right now your controller has no visual.
	//  It’s just an empty THREE.Object3D.
	//  Let’s fix that!

	var
	meshColorOff = 0xDB3236,//  Red.
	meshColorOn  = 0xF4C20D,//  Yellow.
	controllerMaterial = new THREE.MeshStandardMaterial({

		color: meshColorOff
	}),
	controllerMesh = new THREE.Mesh(

		new THREE.CylinderGeometry( 0.005, 0.05, 0.1, 6 ),
		controllerMaterial
	),
	handleMesh = new THREE.Mesh(

		new THREE.BoxGeometry( 0.03, 0.1, 0.03 ),
		controllerMaterial
	)

	controllerMaterial.flatShading = true
	controllerMesh.rotation.x = -Math.PI / 2
	handleMesh.position.y = -0.05
	controllerMesh.add( handleMesh )
	controller.userData.mesh = controllerMesh//  So we can change the color later.
	controller.add( controllerMesh )
	//castShadows( controller )
	//receiveShadows( controller )


	//  Allow this controller to interact with DAT GUI.

	//
	//var guiInputHelper = dat.GUIVR.addInputObject( controller )
	//scene.add( guiInputHelper )


	//  Button events. How easy is this?!
	//  We’ll just use the “primary” button -- whatever that might be ;)
	//  Check out the THREE.VRController.supported{} object to see
	//  all the named buttons we’ve already mapped for you!

	controller.addEventListener( 'primary press began', function( event ){
		//console.dir(event);
		event.target.userData.mesh.material.color.setHex( meshColorOn )
		console.log(event.target);
		//var toVec = new THREE.Vector3();
		
		//controlRaycaster.set(event.target.position,event.target.position.negate());
		//var source = this.getWorldPosition();
		//var target = this.getWorldDirection().negate();
		//var source = event.target.position;
		//var target = event.target.rotation;
		var source = new THREE.Vector3;
		source = source.fromArray(event.target.gamepad.pose.position);
		var target = new THREE.Vector3;
		target = target.fromArray(event.target.gamepad.pose.orientation).multiplyScalar(10);
		//var source = event.target.position;
		//var target = event.target.orientation;
		var geo = new THREE.Geometry();
		geo.vertices.push(source);
		geo.vertices.push(target);
		var material = new THREE.LineBasicMaterial({ color : 0xff0000 });
		var line = new THREE.Line(geo, material);
		scene.add(line);

		controlRaycaster.set(source, target);
		console.log(controlRaycaster);
		//guiInputHelper.pressed( true )
	})
	controller.addEventListener( 'primary press ended', function( event ){

		event.target.userData.mesh.material.color.setHex( meshColorOff )
		//guiInputHelper.pressed( false )
	})


	//  Daddy, what happens when we die?

	controller.addEventListener( 'disconnected', function( event ){

		controller.parent.remove( controller )
	})
})



	document.body.appendChild(WEBVR.createButton(renderer));

	
	scene = new THREE.Scene();
	/* fogColor = new THREE.Color(0x505050);
	scene.background = fogColor; */

	camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 5001);
	scene.add(camera);

	
	crosshair = new THREE.Mesh(
		new THREE.RingBufferGeometry(0.02, 0.04, 32),
		new THREE.MeshBasicMaterial({
			color: 0xffffff,
			opacity: 0.5,
			transparent: true
		})
	);
	crosshair.position.z = -2;
	camera.add(crosshair);
	
	scene.add(new THREE.HemisphereLight(0x606060, 0x404040));
	
	var light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1, 1, 1).normalize();
	scene.add(light);
	
	var imagePrefix = "images/view";
	var directions = ["posx", "negx", "posy", "negy", "posz", "negz"];
	var imageSuffix = ".jpg";
	var skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000);
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push(new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture(imagePrefix + directions[i] + imageSuffix),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
	var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
	scene.add(skyBox);
	
	room = new THREE.Mesh(
		new THREE.BoxBufferGeometry(rmSize, rmSize, rmSize, 8, 8, 8),
		new THREE.MeshBasicMaterial({
			color: 0x404040,
			wireframe: true,
			visible: false
		})
	);
	room.position.y = 3;
	scene.add(room);
	
	aerodrome = new THREE.Object3D();
	scene.add(aerodrome);
	
	fontLoader = new THREE.FontLoader();
	fontLoader.load('fonts/helvetiker_regular.typeface.json', function (font) {
		buildScoreboard(font);
		myfont = font
	});

//----------------------------

	var geometry = new THREE.BoxBufferGeometry(0.15, 0.15, 0.15);

	for (var i = 0; i < obstacleCount; i++) {
		var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
			color: Math.random() * 0xffffff
		}));

		object.position.x = Math.random() * rmSize - rmSize / 2;
		object.position.y = Math.random() * rmSize - rmSize / 2;
		object.position.z = Math.random() * rmSize - rmSize / 2;

		object.rotation.x = Math.random() * 2 * Math.PI;
		object.rotation.y = Math.random() * 2 * Math.PI;
		object.rotation.z = Math.random() * 2 * Math.PI;

		object.scale.x = Math.random() * 2 + 0.5;
		object.scale.y = Math.random() * 2 + 0.5;
		object.scale.z = Math.random() * 2 + 0.5;

		object.userData.velocity = new THREE.Vector3();
		object.userData.velocity.x = Math.random() * 0.08 - 0.04;
		object.userData.velocity.y = Math.random() * 0.08 - 0.04;
		object.userData.velocity.z = Math.random() * 0.08 - 0.04;

		room.add(object);
	}

	raycaster = new THREE.Raycaster();
	controlRaycaster = new THREE.Raycaster();
	
}

init();