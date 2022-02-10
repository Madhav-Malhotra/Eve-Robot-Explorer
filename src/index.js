import { 
  Scene, PerspectiveCamera, WebGLRenderer,
  DirectionalLight, Vector3
} from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';




// ==================== SETUP ====================== //
const scene = new Scene(); // Add scene
const loader = new GLTFLoader(); // Add loader

const renderer = new WebGLRenderer(); // Add renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// Add camera. Arguments (field of view in degrees, aspect ratio, closest render distance, furthest render distance)
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Arguments (camera to orbit, canvas element that graphics are rendered to)
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // Adds 'weight' to how camera moves
controls.autoRotate = true; // Automatically starts orbiting

// Call controls.update() after any manual camera transforms
camera.position.set( 0, 1, 2.3 ); controls.update(); 
camera.lookAt(new Vector3(0,0,0)); controls.update();

document.body.appendChild(renderer.domElement); // Display canvas on page




// ================- ADD OBJECTS ================= //
const light = new DirectionalLight(0xffffff, 0.9);
const light2 = new DirectionalLight(0x08F7FE, 0.9);
const light3 = new DirectionalLight(0xFE53BB, 0.9);
const light4 = new DirectionalLight(0xffffff, 0.9);
let Eve;

const success = (gltf) => {
  Eve = gltf.scene;
  scene.add(Eve);
  light.target = Eve; light2.target = Eve; light3.target = Eve; light4.target = Eve;
} // After load finishes 
const progress = undefined // Report load progress
const fail = (error) => console.error(error); // If load fails 
loader.load('assets/Eve.gltf', success, progress, fail);

scene.add(light); scene.add(light2); scene.add(light3); scene.add(light4);
light.position.set(1,2,3); light2.position.set(1,2,-3);
light3.position.set(-1,2,3); light4.position.set(-1,2,-3);




// ================== RENDER ================= //
function render() {
  requestAnimationFrame(render);
  // Needed BEFORE .render() if controls.enableDamping or controls.autoRotate are set to true 
  controls.update();  
  renderer.render(scene, camera);
}

render();