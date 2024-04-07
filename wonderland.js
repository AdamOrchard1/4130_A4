/*
Assignment 4
Adam Orchard 300169736
Jochen Lang
CSI4130
*/

import * as THREE from "three";
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene = new THREE.Scene();
let camera, renderer, sphereFront, sphereTop;
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

let snowflakes = [];
let numSnowflakes = 250;
let maxRange = 10;
let minRange = -10;
let minHeight = 5;


gui.add(controls, 'cameraZ', 0, 10).onChange(updateCameraPosition);
gui.add(controls, 'cameraY', 0, 10).onChange(updateCameraPosition);
gui.add(controls, 'cameraX', 0, 10).onChange(updateCameraPosition);


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

  //christmas mugs
  const loader = new GLTFLoader();
  loader.load('./mugs/scene.gltf', function(gltf){
    var cups = gltf.scene.children[0];
    scene.add(cups);
    cups.position.set(0,-0.1,0);

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

  //christmas tree
  const treeLoader = new GLTFLoader();
  treeLoader.load('./mini_christmas_tree/scene.gltf', function(gltf){
    var tree = gltf.scene.children[0];
    tree.scale.set(4,4,4); 
    tree.rotation.z += 0.5
    scene.add(tree);
    tree.position.set(-2,-1,-2.5);

  }, undefined, function(error){
    console.error(error);
  });

  //snowman
  const snowmanLoader = new GLTFLoader();
  snowmanLoader.load('./snowman_-_blockbech_project/scene.gltf', function(gltf){
    var snowman = gltf.scene.children[0];
    snowman.scale.set(1,1,1); 
    snowman.rotation.z += 1;
    scene.add(snowman);
    snowman.position.set(2,-1,2);

  }, undefined, function(error){
    console.error(error);
  });

  addLighting();
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


function updateCameraPosition() {
  camera.position.set(controls.cameraX, controls.cameraY, controls.cameraZ);

  camera.lookAt(0, 0, 0);
}

function addLighting() {
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
  scene.add(ambientLight);

  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);
}

function addSnowflakes() {
  for (let i = 0; i < numSnowflakes; i++) {
    // Randomize position around the mugs and the table
    let x = Math.random() * (maxRange - minRange) + minRange;
    let z = Math.random() * (maxRange - minRange) + minRange;
    let y = Math.random() * minHeight;
    snowflakes.push({ x: x, y: y, z: z });
  }
}

// Function to update snowflakes positions
function updateSnowflakes() {
  for (let i = 0; i < numSnowflakes; i++) {
    // Move snowflakes down
    snowflakes[i].y -= 0.05; // Adjust speed as needed

    // If snowflake falls below ground, reset its position
    if (snowflakes[i].y < 0) {
      snowflakes[i].x = Math.random() * (maxRange - minRange) + minRange;
      snowflakes[i].z = Math.random() * (maxRange - minRange) + minRange;
      snowflakes[i].y = minHeight;
    }
  }
}

// Function to render snowflakes
function renderSnowflakes() {
  let snowflakeGeometry = new THREE.BufferGeometry();
  let snowflakeVertices = [];

  // Create vertices for each snowflake
  for (let i = 0; i < numSnowflakes; i++) {
    snowflakeVertices.push(snowflakes[i].x, snowflakes[i].y, snowflakes[i].z);
  }

  // Set snowflake positions
  snowflakeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(snowflakeVertices, 3));

  // Create snowflake material
  let snowflakeMaterial = new THREE.PointsMaterial({
    size: 0.2, // Adjust size as needed
    color: 0xffffff, // Adjust color as needed
    transparent: true,
    opacity: 0.8 // Adjust opacity as needed
  });

  // Create snowflake particles and add them to the scene
  let snowflakeParticles = new THREE.Points(snowflakeGeometry, snowflakeMaterial);
  scene.add(snowflakeParticles);
}

addSnowflakes();

function animate(time) {
  requestAnimationFrame(animate);

  sphereDamping();//allows the damping to work

  updateSnowflakes();

  scene.children.forEach(child => {
    if (child instanceof THREE.Points) {
      scene.remove(child);
    }
  });

  // Render snowflakes
  renderSnowflakes();
  
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