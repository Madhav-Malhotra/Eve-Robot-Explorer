// ================ IMPORTS ==================== //
import './style.css';
import {
    DirectionalLight, Scene, Vector3,
    Object3D, WebGLRenderer, PerspectiveCamera,
    Color, FogExp2
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as dat from 'dat.gui'




// ================ SETUP ==================== //
const gui = new dat.GUI(); //Debug
const canvas = document.querySelector('canvas.webgl');
const scene = new Scene();
const loader = new GLTFLoader(); // Add loader



// ======================= VIEW =================== //
// Add fog
scene.background = new Color( 0xefd1b5 );
scene.fog = new FogExp2( 0xefd1b5, 0.0025 );

// Add camera. Arguments (field of view in degrees, aspect ratio, closest render distance, furthest render distance)
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Controls
const orbit = new OrbitControls(camera, canvas);
orbit.enableDamping = true;

// Call orbit.update() after any manual camera transforms
camera.lookAt(scene.position); orbit.update();

// Renderer
const renderer = new WebGLRenderer({canvas: canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Camera Motion
var temp = new Vector3();
var goal = new Object3D();




// ================ OBJECTS ================= //
// Lights

const light = new DirectionalLight(0xffffff, 0.9);
const light2 = new DirectionalLight(0x08F7FE, 0.9);
const light3 = new DirectionalLight(0xFE53BB, 0.9);
const light4 = new DirectionalLight(0xffffff, 0.9);

scene.add(light); scene.add(light2); scene.add(light3); scene.add(light4);
light.position.set(1,2,3); light2.position.set(1,2,-3);
light3.position.set(-1,2,3); light4.position.set(-1,2,-3);

// Add Eve
let Eve;

const eveLoadSuccess = (gltf) => {
  Eve = gltf.scene;
  Eve.add(goal); scene.add(Eve);
  goal.position.set(-3, 2.1, -2.1);
  orbit.target = Eve.position;
  light.target = Eve; light2.target = Eve; light3.target = Eve; light4.target = Eve;
} // After load finishes 
const progress = undefined // Report load progress
const fail = (error) => console.error(error); // If load fails 
//NOTE: TO ACCESS FILES IN STATIC FOLDER, USE current directory (./)
loader.load('./Eve.glb', eveLoadSuccess, progress, fail); 

// Terrain
let terrain;
const terrainLoadSuccess = (gltf) => {
  terrain = gltf.scene;
  terrain.position.y = -30;
  scene.add(terrain);
}
loader.load('./Mars.glb', terrainLoadSuccess, progress, fail); 


// ===================== FUNCTIONS ====================== //

//Handle mousedown
let mouseDown = 0;
orbit.addEventListener("start", () => ++mouseDown ); // mouseDown = 1
orbit.addEventListener("end", () => --mouseDown); // mouseDown = 0

// Handle keyboard
let key = null;
//Keyboard input
function handleKeyboardInput(e) {
  if (e.key == "ArrowUp") key = "Up";
  if (e.key == "ArrowDown") key = "Down";
  if (e.key == "ArrowLeft") key = "Left";
  if (e.key == "ArrowRight") key = "Right";
};
window.onkeydown = handleKeyboardInput;
window.onkeyup = () => key = null;

// Render
const render = () => {
  if (!mouseDown) {
    //Update camera position
    temp.setFromMatrixPosition(goal.matrixWorld);
    camera.position.lerp(temp, 0.05);
  }

  if (key) {
    if (key == "Up") {
      Eve.translateX(0.15);
      Eve.translateZ(0.15);
    }
    if (key == "Down") {
      Eve.translateX(-0.15);
      Eve.translateZ(-0.15);
    }
    if (key == "Left") Eve.rotation.y += 0.03;
    if (key == "Right") Eve.rotation.y += -0.03;
  }

  // Update Orbital Controls
  orbit.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(render)
};
render();


// ================ RESPONSIVENESS ================== //
const onWindowResize = () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', onWindowResize);