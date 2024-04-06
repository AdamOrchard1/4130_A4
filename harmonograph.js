/*
Assignment 2
Adam Orchard 300169736
Jochen Lang
CSI4130
*/

//import { GLTFLoader } from './three/addons/loaders/GLTFLoader.js';

let scene, cameraFront, cameraTop, renderer, sphereFront, sphereTop;
const gui = new dat.GUI();
const controls = {
  switch: false,
  cameraFrontZ: 5,
  cameraTopY: 5,   
  resetCameras: resetCameras, // Function to reset cameras
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
gui.add(controls, 'reset');

const gui2 = new dat.GUI();
const f1 = gui2.addFolder('Phase Offsets');
f1.add(controls, 'px', 0, 2 * Math.PI).name('Phase X');
f1.add(controls, 'ps', 0, 2 * Math.PI).name('Phase S');
f1.add(controls, 'py', 0, 2 * Math.PI).name('Phase Y');

const f2 = gui2.addFolder('Damping');
f2.add(controls, 'dampingx', 0.9, 1).name('Damping X');
f2.add(controls, 'dampings', 0.9, 1).name('Damping S');
f2.add(controls, 'dampingy', 0.9, 1).name('Damping Y');
f2.add(controls, 'dampingz', 0.9, 1).name('Damping Z');

const f3 = gui2.addFolder('Amplitudes');
f3.add(controls, 'Ax', -10, 10).name('Amplitude X');
f3.add(controls, 'As', -10, 10).name('Amplitude S');
f3.add(controls, 'Ay', -10, 10).name('Amplitude Y');

const f4 = gui2.addFolder('Frequencies');
f4.add(controls, 'wx', 0, 10).name('Frequency X');
f4.add(controls, 'ws', 0, 10).name('Frequency S');
f4.add(controls, 'wy', 0, 10).name('Frequency Y');

gui2.add(controls, 'reset');

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

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //sphere
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  
  //Create front view (blue)
  const materialFront = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }); 
  sphereFront = new THREE.Mesh(geometry, materialFront);
  scene.add(sphereFront);

  //Create top view (orange)
  const materialTop = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); 
  sphereTop = new THREE.Mesh(geometry, materialTop);
  scene.add(sphereTop);

  toggleSpheresVisibility();

  var loader = new THREE.GLTFLoader();
  loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Flamingo.glb', function(gltf){
    // Remove 'var' keyword from here
    model = gltf.scene.children[0]; // Assign to global 'model' variable
    model.scale.set(0.03,0.03,0.03);
    scene.add(model);
    model.position.set(0,0,0);

    sphereInvis();
  }, undefined, function(error){
    console.error(error);
  });
  const Light = new THREE.DirectionalLight( 0xF8CEFF, 0.5 );
  scene.add( Light );

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

//Reset camera position
function resetCameras() {
  cameraFront.position.z = 5;
  cameraTop.position.y = 5;
}

 function updateSpherePosition(time) {
  const x = 
      controls.Ax * Math.sin(controls.wx * time * 2 * Math.PI + controls.px) + 
      controls.As * Math.sin(controls.ws * 2 * time * Math.PI + controls.ps);
  
  const y = controls.Ay * Math.sin(controls.wy * time * 2 * Math.PI + controls.py);
  const z = controls.Az * Math.sin(controls.wz * time * 2 * Math.PI + controls.pz);
  sphereFront.position.set(x, y, z);
  sphereTop.position.set(x, y, z);
  model.position.set(x, y, z);
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

  updateSpherePosition(time * 0.0004);

  sphereDamping();//allows the damping to work

  
  //front view with a blue background
  renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
  renderer.setScissor(0, 0, window.innerWidth / 2, window.innerHeight);
  renderer.setScissorTest(true);
  renderer.setClearColor(0x5AEEFD); //blue
  renderer.clear();
  renderer.render(scene, cameraFront);

  //top view with a orange background
  renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
  renderer.setScissor(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
  renderer.setScissorTest(true);
  renderer.setClearColor(0xFDBF5A); //orange
  renderer.clear();
  renderer.render(scene, cameraTop);
}
init();
animate();