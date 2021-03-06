// airplane source code

var yAxis = new THREE.Vector3(0, 1, 0);
var orbit = 30;
var height = 10;
var soloPlaneSpeed = 0.1;
var soloPlaneDir = -1;


//deprecated. just setting object.rotation.y
/* function rotateAroundWorldAxis(object, axis, radians) {
	var rotWorldMatrix = new THREE.Matrix4();
	rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
	rotWorldMatrix.multiply(object.matrix);
	// pre-multiply
	object.matrix = rotWorldMatrix;
	object.rotation.setFromRotationMatrix(object.matrix, object.order);
} */


var Colors = {
	red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0,
};

var AirPlane = function (col) {

	this.mesh = new THREE.Object3D();

	// Create the cabin
	var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
	var matCockpit = new THREE.MeshLambertMaterial({
		color: (col || Colors.blue)
	});
	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	cockpit.name = "cockpt";
	this.mesh.add(cockpit);

	// Create the engine
	var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
	var matEngine = new THREE.MeshLambertMaterial({
		color: Colors.white
	});
	var engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;
	engine.name = "engn";
	this.mesh.add(engine);

	// Create the tail
	var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
	var matTailPlane = new THREE.MeshLambertMaterial({
		color: Colors.red
	});
	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	tailPlane.position.set(-35, 25, 0);
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;
	tailPlane.name = "tailpln";
	this.mesh.add(tailPlane);

	// Create the wing
	var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
	var matSideWing = new THREE.MeshLambertMaterial({
		color: Colors.red
	});
	var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	sideWing.castShadow = true;
	sideWing.name = "sidewng";
	sideWing.receiveShadow = true;
	this.mesh.add(sideWing);

	// propeller
	var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
	var matPropeller = new THREE.MeshLambertMaterial({
		color: 0xffff00
	});
	this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;

	// blades
	var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
	var matBlade = new THREE.MeshLambertMaterial({
		color: Colors.brownDark
	});
	var blade = new THREE.Mesh(geomBlade, matBlade);
	blade.position.set(8, 0, 0);
	blade.castShadow = true;
	blade.receiveShadow = true;

	this.propeller.add(blade);
	this.propeller.position.set(50, 0, 0);
	this.propeller.name = "prop";
	this.mesh.add(this.propeller);

	//raycast collider

	var geomCollider = new THREE.BoxGeometry(100,50,150,1,1,1);
	var matCollider = new THREE.MeshLambertMaterial({
		color: Colors.brownDark
	});
	var matCollider = new THREE.MeshBasicMaterial();
	matCollider.visible = false;
	var planeCollider = new THREE.Mesh(geomCollider,matCollider);
	planeCollider.name = "collider"; 
	this.mesh.add(planeCollider);
};

function createPlane(scale, color) {
	var plane = new AirPlane(color);
	plane.mesh.scale.set(scale, scale, scale);
	plane.mesh.position.y = 3;
	plane.castShadow = true;
	//scene.add(plane.mesh);
	return plane;
}

var allPlanes = new THREE.Object3D();

for (var i = 0; i< 20; i++){

var airplane1 = createPlane(0.01);
airplane1.mesh.position.y = Math.random() * 10 - 5 + height;
airplane1.mesh.position.x = -(Math.random() * 20 - 10  + orbit);
airplane1.mesh.position.z = -(Math.random() * 20 - 10  + orbit)
airplane1.mesh.rotation.y = Math.PI * 0.5;
allPlanes.add(airplane1.mesh);
}

scene.add(allPlanes);

var airplane5 = createPlane(0.01, Colors.pink);
airplane5.mesh.position.y = Math.random() * 10 - 5 + height;
airplane5.mesh.position.z = Math.random() * 20 - 10  + orbit;
if (soloPlaneDir === -1) airplane5.mesh.rotation.y = Math.PI;
airplane5.name = "airpln5";
var soloPlane = new THREE.Object3D();
soloPlane.name = "soloPln";
soloPlane.add(airplane5.mesh);

aerodrome.add(soloPlane);
