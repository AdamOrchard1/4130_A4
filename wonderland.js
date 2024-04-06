/*
Assignment 4
Adam Orchard 300169736
Jochen Lang
CSI4130
*/

import * as THREE from "three";
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, sphereFront, sphereTop;
const gui = new dat.GUI();
const controls = {
  switch: false,
  cameraZ: 5,
  cameraY: 5, 
  cameraX: 5,  

  reset: function() {
    // Reset all parameters to their initial values
    controls.cameraZ = 5;
    controls.cameraY = 5;
    controls.cameraX = 5;
    resetCameras();
  },
};

var model;

gui.add(controls, 'cameraZ', 0, 10).onChange(updateCameraFrontPosition);
gui.add(controls, 'cameraY', 0, 10).onChange(updateCameraTopPosition);
gui.add(controls, 'cameraX', 0, 10).onChange(updateCameraTopPosition);


function init() {
  scene = new THREE.Scene();

  //camera front
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = controls.cameraZ;
  camera.position.y = controls.cameraY;
  camera.position.x = controls.cameraX; // Set the position in X direction
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let orbitcontrols = new OrbitControls(camera, renderer.domElement);

  addLighting();
  
  //christmas mugs
  const loader = new GLTFLoader();
  loader.load('./mugs/scene.gltf', function(gltf){
    var cups = gltf.scene.children[0];
    scene.add(cups);
    cups.position.set(0,0,0);

  }, undefined, function(error){
    console.error(error);
  });

  //table
  const Tableloader = new GLTFLoader();
  Tableloader.load('./wooden_table/scene.gltf', function(gltf){
    var table = gltf.scene.children[0];
    table.scale.set(0.03,0.03,0.03); 
    scene.add(table);
    table.position.set(0,-0.5,0);

  }, undefined, function(error){
    console.error(error);
  });
  
}



//Update front camera
function updateCameraFrontPosition() {
  cameraFront.position.z = controls.cameraZ;
}

//Update top camera
function updateCameraTopPosition() {
  cameraTop.position.y = controls.cameraY;
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

function addLighting() {
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
  scene.add(ambientLight);

  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);
}

function animate(time) {
  requestAnimationFrame(animate);

  sphereDamping();//allows the damping to work

  // orbitcontrols.update()
  
  //front view with a blue background
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
  renderer.setScissorTest(true);
  renderer.setClearColor(0x5AEEFD); //blue
  renderer.clear();
  renderer.render(scene, camera);
}
init();
animate();