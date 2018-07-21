// init info and globals source code

var clock = new THREE.Clock();

var container;
var camera, scene, raycaster, renderer;

var room;
var aerodrome;
var rmSize= 40;
var isMouseDown = false;

var INTERSECTED;
var PLANE_INTERSECTED;
var crosshair;



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
var directions  = ["posx", "negx", "posy", "negy", "posz", "negz"];
var imageSuffix = ".jpg";
var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );	
	
	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	scene.add( skyBox );

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