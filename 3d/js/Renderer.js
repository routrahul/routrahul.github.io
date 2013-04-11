/**
 * File Name : Renderer.js
 * Author : Rahul Rout
 * Date : 08-02-2013
 * Description : This file is used for the rendering of 3d viz for Sammons algorithm. This file contains the methods
 * and variables used to create the scene,geometry and nodes and links 
 */

/**
 * Variables used for the generation of the graph
 */

var mouseX = 0, mouseY = 0, multiplyScalar, windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2, SEPARATION = 200, AMOUNTX = 5, AMOUNTY = 5, camera, scene, renderer, geometry, group, particle, lineGeometry;
var line,lineMaterial,geometryForLines,lineGroup,particleGroup,text,textMaterial,textObject,textGroup;

/**
 * Function Name : init.
 * In Params : None,
 * Out Params : None
 * Description : This method is used for the initialization of the graph.
 */
function init() {

	var container, separation = 100, amountX = 50, amountY = 50, particles;

	container = document.createElement('div');
	document.body.appendChild(container);

	/**
	 * Provide the camera perspective intialization
	 */
	camera = new THREE.PerspectiveCamera(75, window.innerWidth
			/ window.innerHeight, 1, 10000);
	camera.position.z = 100;

	scene = new THREE.Scene();

	renderer = new THREE.CanvasRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	// particles
	var PI2 = Math.PI * 2;
	var material = new THREE.ParticleCanvasMaterial({

		color : 0xffffff,
		program : function(context) {

			context.beginPath();
			context.arc(0, 0, 1, 0, PI2, true);
			context.closePath();
			context.fill();

		}

	});

	geometry = new THREE.Geometry();
	group = new THREE.Object3D();
	lineGroup = new THREE.Object3D();
	particleGroup = new THREE.Object3D();
	textGroup = new THREE.Object3D();
	multiplyScalar = Math.random() * 20 + 450;

	/**
	 * Creation of the particles is done here - Start
	 */
	for ( var i = 0; i < nodeCoordinates.length; i++) {
		
		particle = new THREE.Particle(material);
		particle.id = nodeCoordinates[i].id;
		particle.position.x = nodeCoordinates[i].xs;
		particle.position.y = nodeCoordinates[i].ys;
		particle.position.z = nodeCoordinates[i].zs;
		particle.position.multiplyScalar(150);
		particleGroup.add(particle);

		geometry.vertices.push(particle.position);
//		geometry.vertices.push(textObject.position);

	}
	/**
	 * Creation of the particles is done here - Ends
	 */
	
	for(var i=0;i<linksCoordinatesForSource.length;i++)
	{
		geometryForLines = new THREE.Geometry();
		lineMaterial = new THREE.LineBasicMaterial({
	        color: 0xffffff,
	        opacity : 0.3
	    });
		geometryForLines.vertices.push(new THREE.Vector3(linksCoordinatesForSource[i].xs,
		 linksCoordinatesForSource[i].ys, linksCoordinatesForSource[i].zs));
		geometryForLines.vertices[(geometryForLines.vertices.length)-1].multiplyScalar( 150 );
		geometryForLines.vertices.push(new THREE.Vector3(linksCoordinatesForTarget[i].xs,
		 linksCoordinatesForTarget[i].ys, linksCoordinatesForTarget[i].zs));
		geometryForLines.vertices[(geometryForLines.vertices.length)-1].multiplyScalar( multiplyScalar );
		line = new THREE.Line(geometryForLines, lineMaterial);
		lineGroup.add(line);
	}
	
	group.add(lineGroup);
	group.add(particleGroup);
					
	for(var j=0;j<group.children[0].children.length;j++)
	{
		if(linksCoordinatesForSource[j].value < 0)
		{
			group.children[0].children[j].material.color.setRGB(204,0,0);
		}
		else if(linksCoordinatesForSource[j].value > 0)
		{
			group.children[0].children[j].material.color.setRGB(0,204,0);
		}
		else if(linksCoordinatesForSource[j].value == 0)
		{
			group.children[0].children[j].material.opacity = 0;
		}	
	}	
	scene.add(group);

	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('touchstart', onDocumentTouchStart, false);
	document.addEventListener('touchmove', onDocumentTouchMove, false);


	window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function onDocumentMouseMove(event) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart(event) {

	if (event.touches.length > 1) {

		event.preventDefault();

		mouseX = event.touches[0].pageX - windowHalfX;
		mouseY = event.touches[0].pageY - windowHalfY;

	}

}

function onDocumentTouchMove(event) {

	if (event.touches.length == 1) {

		event.preventDefault();

		mouseX = event.touches[0].pageX - windowHalfX;
		mouseY = event.touches[0].pageY - windowHalfY;

	}

}

//

function animate() {

	requestAnimationFrame(animate);

	render();

}

function render() {

	var time = Date.now() * 0.001;

	var rx = Math.sin(time * 0.7) * 0.5, ry = Math.sin(time * 0.3) * 0.5, rz = Math
			.sin(time * 0.2) * 0.5;

	camera.position.x += (mouseX - camera.position.x) * .05;
	camera.position.y += (-mouseY - camera.position.y) * .05;
	//				camera.position.x = -960;
	//				camera.position.y = -190;
	camera.lookAt(scene.position);

	group.rotation.x = rx;
	group.rotation.y = ry;
	group.rotation.z = rz;

	renderer.render(scene, camera);

}
