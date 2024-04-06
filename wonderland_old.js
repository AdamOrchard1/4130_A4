/*
Assignment 4
Adam Orchard 300169736
Jochen Lang
CSI4130
*/

import * as THREE from "three";
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';


let scene, cameraFront, cameraTop, renderer, sphereFront, sphereTop;
const gui = new dat.GUI();
const controls = {
  switch: false,
  cameraFrontZ: 5,
  cameraTopY: 5, 
  cameraTopX: 5,  
  //resetCameras: resetCameras, // Function to reset cameras
  px: 0,  
  ps: 0,  
  py: 0,
  pz: 0, 
  Ax: 1, 
  As: 1, 
  Ay: 1, 
  Az: 1,
  //W IS FREQUENCY
  wx: 5,  
  ws: 4,  
  wy: 3,
  wz: 2,  
  dampingx: 0.9, 
  dampings: 0.9, 
  dampingy: 0.9, 
  dampingz: 0.9, 
  reset: function() {
    // Reset all parameters to their initial values
    controls.cameraFrontZ = 5;
    controls.cameraTopY = 5;
    resetCameras();
    this.px = 0;  
    this.ps = 0;  
    this.py = 0;
    this.pz = 0; 
    this.Ax = 1; 
    this.As = 1.5; 
    this.Ay = 2;
    this.Az = 1;
    this.wx = 2;  
    this.ws = 1;  
    this.wy = 1;
    this.wz = 1;  
    this.dampingx = 0.9; 
    this.dampings = 0.9; 
    this.dampingy = 0.9; 
    this.dampingz = 0.9; 
  },
};

var model;

gui.add(controls, 'cameraFrontZ', 0, 10).onChange(updateCameraFrontPosition);
gui.add(controls, 'cameraTopY', 0, 10).onChange(updateCameraTopPosition);
gui.add(controls, 'cameraTopX', 0, 10).onChange(updateCameraTopPosition);

gui.add(controls, 'reset');

gui.add(controls, 'reset');

const dampingGUI = new dat.GUI();
dampingGUI.add(controls, 'switch').name("Toggle Damping");
dampingGUI.open()



function init() {
  scene = new THREE.Scene();

  //camera front
  cameraFront = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraFront.position.z = controls.cameraFrontZ;

  //camera top
  cameraTop = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraTop.position.y = controls.cameraTopY;
  cameraTop.lookAt(0, 0, 0);

  cameraTop = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraTop.position.x = controls.cameraTopX;
  cameraTop.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // //sphere
  // const geometry = new THREE.BoxGeometry(1, 1, 1);
  
  // //Create front view (blue)
  // const materialFront = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }); 
  // sphereFront = new THREE.Mesh(geometry, materialFront);
  // scene.add(sphereFront);

  // //Create top view (orange)
  // const materialTop = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); 
  // sphereTop = new THREE.Mesh(geometry, materialTop);
  // scene.add(sphereTop);

  // toggleSpheresVisibility();

  const loader = new GLTFLoader();
  loader.load('./mugs/scene.gltf', function(gltf){
    var cups = gltf.scene.children[0];
    scene.add(cups);
    cups.position.set(0,0,0);

  }, undefined, function(error){
    console.error(error);
  });
  
}

//Bird invis
controls.sphereInvis = true;
function sphereInvis() {
  model.visible = controls.sphereInvis;
}
gui.add(controls, 'sphereInvis').name('Toggle Model Visibility').onChange(sphereInvis);


//sphere invis
controls.toggleSpheresVisibility = true;

//toggle invis 
function toggleSpheresVisibility() {
  sphereTop.visible = controls.toggleSpheresVisibility;
  sphereFront.visible = controls.toggleSpheresVisibility;
}

//gui controls for invis
gui.add(controls, 'toggleSpheresVisibility').name('Toggle Spheres Visibility').onChange(toggleSpheresVisibility);

//Update front camera
function updateCameraFrontPosition() {
  cameraFront.position.z = controls.cameraFrontZ;
}

//Update top camera
function updateCameraTopPosition() {
  cameraTop.position.y = controls.cameraTopY;
}

//Toggle button for damping
function sphereDamping(){
  if (controls.switch){
    controls.Ax *= controls.dampingx;
    controls.Ay *= controls.dampingy;
    controls.Az *= controls.dampingz;
    controls.As *= controls.dampings;
  }
}

function animate(time) {
  requestAnimationFrame(animate);

  //updateSpherePosition(time * 0.0004);

  sphereDamping();//allows the damping to work

  
  //front view with a blue background
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
  renderer.setScissorTest(true);
  renderer.setClearColor(0x5AEEFD); //blue
  renderer.clear();
  renderer.render(scene, cameraFront);
}
init();
animate();