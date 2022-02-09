import { 
  Scene, PerspectiveCamera, WebGLRenderer,
  BoxGeometry, MeshBasicMaterial, Mesh,
} from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ==================== SETUP ====================== //
const scene = new Scene(); //Add scene

//Add camera. Arguments (field of view in degrees, aspect ratio, closest render distance, furthest render distance)
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer(); //Add renderer
renderer.setSize(window.innerWidth, window.innerHeight);

const loader = new GLTFLoader(); // Add loader

document.body.appendChild(renderer.domElement); // Display canvas on page




// ================- ADD OBJECTS ================= //
const success = (gltf) => scene.add(gltf.scene); // After load finishes 
const progress = undefined // Report load progress
const fail = (error) => console.error(error); // If load fails 
loader.load('assets/Eve.gltf', success, progress, fail);

camera.position.set( 0, 0, 2 );




// ================== RENDER ================= //
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();