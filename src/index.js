import { 
  Scene, PerspectiveCamera, WebGLRenderer,
  DirectionalLight, Vector3
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
const light = new DirectionalLight(0xffffff, 0.9);
const light2 = new DirectionalLight(0xffffff, 0.9);
let Eve;

const success = (gltf) => {
  Eve = gltf.scene;
  scene.add(Eve);
  light.target = Eve; light2.target = Eve;
} // After load finishes 
const progress = undefined // Report load progress
const fail = (error) => console.error(error); // If load fails 
loader.load('assets/Eve.gltf', success, progress, fail);

camera.position.set( 0, 1, 2.3 ); camera.lookAt(new Vector3(0,0,0));

scene.add(light); scene.add(light2);
light.position.set(1,1,1); light2.position.set(-1,-1,1)

// ================== RENDER ================= //
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  Eve.rotation.y += 0.01;
}

render();