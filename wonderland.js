/*
Assignment 4
Adam Orchard 300169736
Jochen Lang
CSI4130
*/

import * as THREE from "three";
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';


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

let cameraMovementUnlocked = false;

// Add a checkbox to the GUI to toggle camera movement unlocking
gui.add(controls, 'switch').name('Unlock Camera Movement').onChange(function(value) {
    cameraMovementUnlocked = value;
});

// Listen for keydown events to move the camera when movement is unlocked
document.addEventListener('keydown', function(event) {
    if (cameraMovementUnlocked) {
        const speed = 2; // Adjust movement speed as needed

        switch(event.key) {
            case 'w':
                camera.position.z -= speed;
                break;
            case 'a':
                camera.position.x -= speed;
                break;
            case 's':
                camera.position.z += speed;
                break;
            case 'd':
                camera.position.x += speed;
                break;
            case 'r':
                camera.position.y += speed;
                break;
            case 'f':
                camera.position.y -= speed;
                break;
        }
    }
});


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

  const loader2 = new FBXLoader();
  loader2.load('./penguin-rigged-and-animated/source/Penguin.fbx', function (fbx) {
      // Create an AnimationMixer
      const mixer = new THREE.AnimationMixer(fbx);

      // Access animation clips
      const animations = fbx.animations;

      // If animations are available, play the first one
      if (animations && animations.length > 0) {
          const action = mixer.clipAction(animations[0]);
          action.play();
      }

      scene.add(fbx);
  });

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

  const santa = new GLTFLoader();
  santa.load('./santa_model/scene.gltf', function(gltf){
    var santa = gltf.scene.children[0];
    santa.scale.set(1,1,1); 
    santa.rotation.z += 1;
    scene.add(santa);
    santa.position.set(-3,-1,-0.5);

  }, undefined, function(error){
    console.error(error);
  });

  const presentLoader = new GLTFLoader();
presentLoader.load('./simple_present/scene.gltf', function(gltf){
  var present = gltf.scene.children[0];
  present.scale.set(0.25, 0.25, 0.25); // Adjust scale as needed
  scene.add(present);
  present.position.set(-1, -1, -2); // Adjust position under the tree
}, undefined, function(error){
  console.error(error);
});

const presentLoader2 = new GLTFLoader();
presentLoader2.load('./wrapped_present/scene.gltf', function(gltf){
  var present = gltf.scene.children[0];
  present.scale.set(0.003, 0.003, 0.003); // Adjust scale as needed
  scene.add(present);
  present.position.set(-0.8, -1, -3.8); // Adjust position under the tree
}, undefined, function(error){
  console.error(error);
});

const snowglobe = new GLTFLoader();
snowglobe.load('./snow_globe_base/scene.gltf', function(gltf){
  var snowglobe = gltf.scene.children[0];
  snowglobe.scale.set(3, 3, 3); // Adjust scale as needed
  scene.add(snowglobe);
  snowglobe.position.set(-1, -7.5, -2); // Adjust position under the tree
}, undefined, function(error){
  console.error(error);
});

// Define snow material
const snowTexture = new THREE.TextureLoader().load('./snow_raw_scan/textures/snow_1_1_baseColor.png'); // Load your snow texture image
const snowMaterial = new THREE.MeshBasicMaterial({ map: snowTexture });

// Create circle geometry
const circleRadius = 9.9; // Adjust as needed
const circleSegments = 64; // Adjust for smoothness
const circleGeometry = new THREE.CircleGeometry(circleRadius, circleSegments);

// Rotate the circle to lay flat
circleGeometry.rotateX(-Math.PI / 2);

// Create circle mesh with snow material
const circleMesh = new THREE.Mesh(circleGeometry, snowMaterial);

// Lower the circle snow floor
const moveY = -1.155; // Adjust as needed
circleMesh.position.y = moveY;

// Lower the circle snow floor
const moveX = -1.4; // Adjust as needed
circleMesh.position.x = moveX;

const moveZ = -1.9; // Adjust as needed
circleMesh.position.z = moveZ;

// Add circle mesh to the scene
scene.add(circleMesh);

/*const snowground = new GLTFLoader();
snowground.load('./snow_raw_scan/scene.gltf', function(gltf){
  var snowground = gltf.scene.children[0];
  snowground.scale.set(2, 2, 2); 
  
  snowground.position.set(-1, -1, -2); 

  scene.add(snowground);
}, undefined, function(error){
  console.error(error);
});
*/
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