// ================ IMPORTS ==================== //
import './style.css';
import {
    DirectionalLight, Scene, Vector3,
    Object3D, WebGLRenderer, PerspectiveCamera,
    Color, FogExp2,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



// ================ SETUP ==================== //
const canvas = document.querySelector('canvas.webgl');
let opened = false;
canvas.addEventListener("click", () => {canvas.requestPointerLock(); opened = true;})
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

// Dir
const dirLight = new DirectionalLight( 0xbe8484, 2 );
dirLight.position.set( - 1, 1.75, 1.1 );
dirLight.position.multiplyScalar( 50 );
scene.add( dirLight );

const dirLight2 = new DirectionalLight( 0xbe8484, 0.7 );
dirLight2.position.set( 1, 1.75, -1.1 );
dirLight2.position.multiplyScalar( 50 );
scene.add( dirLight2 );

const dirLight3 = new DirectionalLight( 0xbe8484, 0.7 );
dirLight3.position.set( -1, 1.75, -1.1 );
dirLight3.position.multiplyScalar( 50 );
scene.add( dirLight3 );

const dirLight4 = new DirectionalLight( 0xbe8484, 0.7 );
dirLight4.position.set( 1, 1.75, 1.1 );
dirLight4.position.multiplyScalar( 50 );
scene.add( dirLight4 );


// Add Eve
const empty = new Object3D();
empty.rotateY(Math.PI / 4)
let Eve;

const eveLoadSuccess = (gltf) => {
  Eve = gltf.scene;
  gltf.scene.traverse( function( node ) { //.traverse runs on obj and any children
    if ( node.isMesh ) { node.castShadow = true; } // For casting shadows
  });

  Eve.add(goal); empty.attach(Eve); scene.add(empty);
  goal.position.set(-3, 2.1, -2.1);
  orbit.target = empty.position;
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
let key = {};
//Keyboard input
window.onkeydown = (e) => key[e.key] = true;
window.onkeyup = (e) => key[e.key] = false;

// Handle mouse
let mouseY, mouseX;
window.addEventListener("mousemove", (e) => {mouseY = e.movementY; mouseX = e.movementX;})

//Turn off pointer lock
if ("onpointerlockchange" in document) {
  document.addEventListener('pointerlockchange', lockChangeAlert, false);
} else if ("onmozpointerlockchange" in document) {
  document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
}

function lockChangeAlert() {
  if(document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) null 
  else opened = false;
}

// Render
const render = () => {
  if (!mouseDown) {
    //Update camera position
    temp.setFromMatrixPosition(goal.matrixWorld);
    camera.position.lerp(temp, 0.07);
  }

  if (Eve && opened) {
    if (key["ArrowUp"]) empty.translateZ(0.15);
    if (key["ArrowDown"]) empty.translateZ(-0.15);
    if (key["ArrowLeft"]) empty.rotateY(0.03);
    if (key["ArrowRight"]) empty.rotateY(-0.03);

    //Mouse motion
    empty.rotateX(mouseY / 1000);
    empty.rotateY(-mouseX / 1000);
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