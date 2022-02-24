//Keyboard input
export function handleKeyboardInput(e, key) {
  if (e.key == "ArrowUp") key = "Up";
  if (e.key == "ArrowDown") key = "Down";
  if (e.key == "ArrowLeft") key = "Left";
  if (e.key == "ArrowRight") key = "Right";
};

//Responsiveness
export const onWindowResize = (camera, renderer) => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}