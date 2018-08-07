// init info and globals source code

var clock = new THREE.Clock();
var container;
var camera;
var scene, raycaster, controlRaycaster, renderer;

var interval = 30;
var count = 0;
var room;
var aerodrome;
var rmSize = 10;
var isMouseDown = false;
var planeCount = 12;

var cubeTopSpeed = 0.03;
var cubeLowSpeed = 0.02;

var obstacleCount = 150;

var INTERSECTED;
var PLANE_INTERSECTED;
var crosshair;

var fontLoader;
var textMesh;
var score = 0;
var myfont = null;
var scoreboardMesh;
var scoreboard;
var arrows = [];

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
	textMesh.position.x = -0.4;
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
	scoreboard.position.y = -0.2;
	scoreboard.position.z = 0.2;
	//scoreboard.rotation.x = Math.PI/180 * 20 ;  //something the matter here- gimbal lock?
	scoreboard.rotation.y = Math.PI * 1.5;

	scene.add(scoreboard);
}

function updateScore(val) {
	score += val;
	textMesh.geometry.dispose();
	textMesh.geometry = new THREE.TextGeometry(score.toString(), {
		font: myfont,
		size: .5,
		height: .1,
		curveSegments: 16,
	});
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

function testHit() {

	// find intersections of objects with controller raycaster
	var intersects = controlRaycaster.intersectObjects(room.children, false);

	if (intersects.length > 0) {
		if (INTERSECTED != intersects[0].object) {
			if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
			INTERSECTED = intersects[0].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex(0xff0000);
			console.log(INTERSECTED);
			updateScore(2);
		}

	} else {
		if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
		INTERSECTED = undefined;
	}

	if (aerodrome.children.length > 0 && INTERSECTED === undefined) {
		var plane_intersects = controlRaycaster.intersectObjects(aerodrome.children, true);

		if (plane_intersects.length > 0) {

			if (PLANE_INTERSECTED != plane_intersects[0].object) {

				//if (PLANE_INTERSECTED) PLANE_INTERSECTED.material.emissive.setHex(PLANE_INTERSECTED.currentHex);
				PLANE_INTERSECTED = plane_intersects[0].object;
				console.log("Hit the target");
				//console.log(PLANE_INTERSECTED);

				updateScore(5);

				textMesh.position.x = -0.2;
				textMesh.position.y = -0.25;
				textMesh.position.z = 0.2;

				aerodrome.remove(soloPlane);
				airplane5 = createPlane(0.01, Colors.pink);
				soloPlaneDir = (Math.random() >= 0.5 ? -1 : 1);
				airplane5.mesh.position.y = Math.random() * 10 - 5 + height;
				airplane5.mesh.position.z = Math.random() * 20 - 10 + orbit;
				if (soloPlaneDir === -1) airplane5.mesh.rotation.y = Math.PI;
				soloPlane = new THREE.Object3D();
				soloPlane.add(airplane5.mesh);
				var oldPlaneSpeed = soloPlaneSpeed;
				while (soloPlaneSpeed === oldPlaneSpeed || soloPlaneSpeed > 0.8 || soloPlaneSpeed < 0.35) {
					soloPlaneSpeed = Math.random();
				}
				aerodrome.add(soloPlane);
			}

		} else {
			PLANE_INTERSECTED = undefined;
		}
	}



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

	window.addEventListener('vr controller connected', function (event) {

		//  Here it is, your VR controller instance.
		//  It’s really a THREE.Object3D so you can just add it to your scene:

		var controller = event.detail
		scene.add(controller)

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

		//  Controller mesh:
		var
			meshColorOff = 0xDB3236, //  Red.
			meshColorOn = 0xF4C20D, //  Yellow.
			controllerMaterial = new THREE.MeshStandardMaterial({

				color: meshColorOff
			}),
			controllerMesh = new THREE.Mesh(

				new THREE.CylinderGeometry(0.005, 0.05, 0.1, 6),
				controllerMaterial
			),
			handleMesh = new THREE.Mesh(

				new THREE.BoxGeometry(0.03, 0.1, 0.03),
				controllerMaterial
			)

		controllerMaterial.flatShading = true
		controllerMesh.rotation.x = -Math.PI / 2
		handleMesh.position.y = -0.05
		controllerMesh.add(handleMesh)
		controller.userData.mesh = controllerMesh //  So we can change the color later.
		controller.add(controllerMesh)

		var tPosition = new THREE.Vector3();
		var tDirection = new THREE.Vector3(0, 0, -1);
		var tMatrix = new THREE.Matrix4();

		tPosition.set(0, 0, 0).setFromMatrixPosition(controller.matrixWorld);
		tMatrix.identity().extractRotation(controller.matrixWorld);
		tDirection.set(0, 0, 0).applyMatrix4(tMatrix).normalize();

		var arrowHelper;
		var arrowDirection = new THREE.Vector3();
		var arrowPosition1 = new THREE.Vector3();
		var arrowOutDirection = new THREE.Vector3(0, 0, -1);
		arrowDirection.subVectors(arrowOutDirection, tPosition).normalize();
		arrowHelper = new THREE.ArrowHelper(arrowDirection, tPosition, 1.9, 0xffff00, 0.2, 0.03);
		controller.add(arrowHelper);

		controlRaycaster = new THREE.Raycaster(controller.position, new THREE.Vector3(0, 0, 0));

		controller.addEventListener('primary press began', function (event) {
			event.target.userData.mesh.material.color.setHex(meshColorOn)

			var tPosition = new THREE.Vector3();
			var tDirection = new THREE.Vector3(0, 0, -1);
			var tMatrix = new THREE.Matrix4();

			tPosition.set(0, 0, 0).setFromMatrixPosition(controller.matrixWorld);
			tMatrix.identity().extractRotation(controller.matrixWorld);
			tDirection.set(0, 0, -1).applyMatrix4(tMatrix).normalize();

			controlRaycaster.set(tPosition, tDirection);
			let traceArrow = (new THREE.ArrowHelper(controlRaycaster.ray.direction, controlRaycaster.ray.origin, 400, 0xff0000, 0.2, 0.3));
			arrows.unshift(traceArrow);
			scene.add(arrows[0]);
			updateScore(-3);
			console.log(controlRaycaster);

			testHit();
		})

		controller.addEventListener('primary press ended', function (event) {
			event.target.userData.mesh.material.color.setHex(meshColorOff)
		})

		controller.addEventListener('disconnected', function (event) {
			controller.parent.remove(controller)
		})
	})

	//here we go....
	document.body.appendChild(WEBVR.createButton(renderer));
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 5001);
	scene.add(camera);

	/* 	crosshair = new THREE.Mesh(
			new THREE.RingBufferGeometry(0.02, 0.04, 32),
			new THREE.MeshBasicMaterial({
				color: 0xffffff,
				opacity: 0.5,
				transparent: true
			})
		);
		crosshair.position.z = -2;
		camera.add(crosshair); */

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

	//boxes and later, debris...

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
		object.userData.velocity.x = Math.random() * cubeTopSpeed - cubeLowSpeed;
		object.userData.velocity.y = Math.random() * cubeTopSpeed - cubeLowSpeed;
		object.userData.velocity.z = Math.random() * cubeTopSpeed - cubeLowSpeed;

		room.add(object);
	}

	//raycaster = new THREE.Raycaster();
	controlRaycaster = new THREE.Raycaster();

}

init();