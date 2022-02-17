// ================ IMPORTS ==================== //
import './style.css'
import {
    DirectionalLight, Scene, Vector3,
    Object3D, WebGLRenderer, PerspectiveCamera
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'



// ================ SETUP ==================== //
const gui = new dat.GUI(); //Debug
const canvas = document.querySelector('canvas.webgl');
const scene = new Scene();
const loader = new GLTFLoader(); // Add loader



// ================ OBJECTS ================= //
// Lights

const light = new DirectionalLight(0xffffff, 0.9);
const light2 = new DirectionalLight(0x08F7FE, 0.9);
const light3 = new DirectionalLight(0xFE53BB, 0.9);
const light4 = new DirectionalLight(0xffffff, 0.9);

scene.add(light); scene.add(light2); scene.add(light3); scene.add(light4);
light.position.set(1,2,3); light2.position.set(1,2,-3);
light3.position.set(-1,2,3); light4.position.set(-1,2,-3);

// Add mesh
let Eve;

const success = (gltf) => {
  Eve = gltf.scene;
  scene.add(Eve);
  light.target = Eve; light2.target = Eve; light3.target = Eve; light4.target = Eve;
} // After load finishes 
const progress = undefined // Report load progress
const fail = (error) => console.error(error); // If load fails 
//NOTE: TO ACCESS FILES IN STATIC FOLDER, USE root directory (/)
loader.load('/Eve.gltf', success, progress, fail); 




// ================ RESPONSIVENESS ================== //
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});




// ======================= VIEW =================== //
// Add camera. Arguments (field of view in degrees, aspect ratio, closest render distance, furthest render distance)
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Controls
const orbit = new OrbitControls(camera, canvas);
orbit.enableDamping = true;

// Call orbit.update() after any manual camera transforms
camera.position.set( 0, 1, 2.3 ); orbit.update(); 
camera.lookAt(new Vector3(0,0,0)); orbit.update();

// Renderer
const renderer = new WebGLRenderer({canvas: canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));




// ===================== FUNCTIONS ====================== //

const render = () => {
  // Update Orbital Controls
  orbit.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(render)
};
render();
window.onkeydown = handleKeyboardInput;
function handleKeyboardInput(e) {
  if (e.key == "ArrowUp") {
    Eve.translateX(0.05);
    Eve.translateZ(0.05);
  }
  if (e.key == "ArrowDown") {
    Eve.translateX(-0.05);
    Eve.translateZ(-0.05);
  }
  if (e.key == "ArrowLeft") {
    Eve.rotation.y -= 0.05;
  }
  if (e.key == "ArrowRight") {
    Eve.rotation.y += 0.05;
  }
}