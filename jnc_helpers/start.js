// init info and globals source code

var clock = new THREE.Clock();

var container;
var camera, scene, raycaster, renderer;

var room;
var aerodrome;
var rmSize = 10;
var isMouseDown = false;

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