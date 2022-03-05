// ================ IMPORTS ==================== //
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// ================= INIT ==================== //
let canvas, opened, scene, camera, renderer, 
orbit, temp, goal, empty, Eve, mouseDown, 
mouseX, mouseY, key, boundBox, terrain;

function init() {
  // ================ SETUP ==================== //
  canvas = document.querySelector('canvas.webgl');
  opened = false;
  canvas.addEventListener("click", () => {canvas.requestPointerLock(); opened = true;})
  scene = new THREE.Scene();
  const loader = new GLTFLoader(); // Add loader




  // ======================= VIEW =================== //
  // Add fog
  scene.background = new THREE.Color( 0xefd1b5 );
  scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );

  // Add camera. Arguments (field of view in degrees, aspect ratio, closest render distance, furthest render distance)
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Controls
  orbit = new OrbitControls(camera, canvas);
  orbit.enableDamping = true;

  // Call orbit.update() after any manual camera transforms
  camera.lookAt(scene.position); orbit.update();

  // Renderer
  renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Camera Motion
  temp = new THREE.Vector3();
  goal = new THREE.Object3D();





  // ================ OBJECTS ================= //
  // Lights
  const dirLight = new THREE.DirectionalLight( 0xbe8484, 2 );
  dirLight.position.set( - 1, 1.75, 1.1 );
  dirLight.position.multiplyScalar( 50 );
  scene.add( dirLight );

  const dirLight2 = new THREE.DirectionalLight( 0xbe8484, 0.7 );
  dirLight2.position.set( 1, 1.75, -1.1 );
  dirLight2.position.multiplyScalar( 50 );
  scene.add( dirLight2 );

  const dirLight3 = new THREE.DirectionalLight( 0xbe8484, 0.7 );
  dirLight3.position.set( -1, 1.75, -1.1 );
  dirLight3.position.multiplyScalar( 50 );
  scene.add( dirLight3 );

  const dirLight4 = new THREE.DirectionalLight( 0xbe8484, 0.7 );
  dirLight4.position.set( 1, 1.75, 1.1 );
  dirLight4.position.multiplyScalar( 50 );
  scene.add( dirLight4 );


  // Add Eve
  empty = new THREE.Object3D();
  empty.rotateY(Math.PI / 4)

  // After load finishes 
  const eveLoadSuccess = (gltf) => {
    Eve = gltf.scene;
    Eve.add(goal); empty.attach(Eve); scene.add(empty);
    goal.position.set(-3, 2.1, -2.1);
    orbit.target = empty.position;

    // Get bounding box
    boundBox = new THREE.BoxHelper(Eve, 0x00ff00);
    boundBox.matrixAutoUpdate = true;
    boundBox.material.visible = false;
    scene.add(boundBox);
  };
  const progress = undefined // Report load progress
  const fail = (error) => console.error(error); // If load fails 
  //NOTE: TO ACCESS FILES IN STATIC FOLDER, USE current directory (./)
  loader.load('./Eve.glb', eveLoadSuccess, progress, fail); 


  // Terrain
  terrain;
  const terrainLoadSuccess = (gltf) => {
    terrain = gltf.scene;
    terrain.position.y = -30;
    scene.add(terrain);
  }
  loader.load('./Mars.glb', terrainLoadSuccess, progress, fail); 




  // ===================== FUNCTIONS ======================== //
  //Handle mousedown
  mouseDown = 0;
  orbit.addEventListener("start", () => ++mouseDown ); // mouseDown = 1
  orbit.addEventListener("end", () => --mouseDown); // mouseDown = 0

  // Handle keyboard
  key = {};
  //Keyboard input
  window.onkeydown = (e) => key[e.key] = true;
  window.onkeyup = (e) => key[e.key] = false;

  // Handle mouse
  mouseY, mouseX;
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
}



// ================ RENDER ================== //
const render = () => {
  // Call again on the next frame
  window.requestAnimationFrame(render)

  if (Eve && opened) {
    if (key["ArrowUp"]) empty.translateZ(0.15);
    if (key["ArrowDown"]) empty.translateZ(-0.15);
    if (key["ArrowLeft"]) empty.rotateY(0.03);
    if (key["ArrowRight"]) empty.rotateY(-0.03);

    //Mouse motion
    empty.rotateX(mouseY / 1000);
    empty.rotateY(-mouseX / 1000);
  }

  if (boundBox) {
    boundBox.update();
    detectCollision();
  }

  if (!mouseDown) {
    //Update camera position
    temp.setFromMatrixPosition(goal.matrixWorld);
    camera.position.lerp(temp, 0.07);
  }

  // Update Orbital Controls
  if (orbit) orbit.update();

  // Render
  renderer.render(scene, camera);
};

window.onload = () => {init(); render();};




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



// ================ COLLISION DETECTION ================== //
function detectCollision() {
  // Get boundbox edeges
  const vertices = boundBox.geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i+=3) {
    // Get global coordinates of edge
    const l = new THREE.Vector3(vertices[i],vertices[i+1],vertices[i+2]);
    const g = l.applyMatrix4(boundBox.matrix);
    //Get line going from centre of Eve to boundbox edge
    let pos = new THREE.Vector3();
    Eve.getWorldPosition(pos);
    const dir = g.sub( pos );

    //Send a ray out in that direction and see if it collides with anything
    const ray = new THREE.Raycaster( pos, dir.clone().normalize() );
    const collisions = ray.intersectObjects( [terrain.children[0]] );

    //If collision
    if ( collisions.length > 0 && collisions[0].distance < 0.95*dir.length() ) {
      empty.translateOnAxis(dir.clone().normalize(), -0.05);
    }
  }
}