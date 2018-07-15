// init info and globals source code

			var clock = new THREE.Clock();

			var container;
			var camera, scene, raycaster, renderer;

			var room;
			var aerodrome;
			var isMouseDown = false;

			var INTERSECTED;
			var PLANE_INTERSECTED;
			var crosshair;

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				var info = document.createElement( 'div' );
				info.style.position = 'absolute';
				info.style.top = '10px';
				info.style.fontSize = '1.2em';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> jnc - cubes and planes';
				container.appendChild( info );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x505050 );

				room = new THREE.Mesh(
					new THREE.BoxBufferGeometry( 10, 10, 10, 8, 8, 8 ),
					new THREE.MeshBasicMaterial( { color: 0x404040, wireframe: true } )
				);
				room.position.y = 3;
				scene.add( room );

				aerodrome = new THREE.Object3D();
				scene.add(aerodrome);