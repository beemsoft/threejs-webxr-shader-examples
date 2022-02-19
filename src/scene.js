import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {
    BufferGeometry,
    Float32BufferAttribute,
    Group,
    Mesh,
    PerspectiveCamera,
    Scene,
    ShaderMaterial,
    TextureLoader,
    Vector3,
    WebGLRenderer
} from 'three';
import {VRButton} from 'three/examples/jsm/webxr/VRButton.js';
import TWEEN from '@tweenjs/tween.js/dist/tween.esm.js';

const cameraGroup = new Group();
const canvas = document.querySelector('canvas');
const context = canvas.getContext('webgl2', {alpha: false, xrCompatible: true});
const renderer = new WebGLRenderer({canvas: canvas, context: context});
renderer.xr.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.enabled = false;
const scene = new Scene();
window.scene = scene;
const camera = new PerspectiveCamera();
cameraGroup.add(camera);
scene.add(cameraGroup);
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.target = new Vector3(0, 1, -5);
camera.position.set(0, 1.6, 0);
controls.update();

function onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    console.log("Width: " + w + ", heigth: " + h);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}
window.addEventListener('resize', onWindowResize, false);
onWindowResize();

function buildMesh(width, height, position) {
    const geom = new BufferGeometry();
    const positions = new Float32Array([
     -width + position.x, -height + position.y, position.z,
     -width + position.x, height, position.z,
      width + position.x, height + position.y, position.z,
      width + position.x, -height + position.y, position.z
    ]);

    geom.setIndex([0,2,1, 0,3,2]);

    const uvs = new Float32Array([
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,
        1.0, 0.0
    ]);

    const positionAttribute = new Float32BufferAttribute( positions, 3 );
    geom.setAttribute( 'position', positionAttribute );
    const uvAttribute = new Float32BufferAttribute( uvs, 2 );
    geom.setAttribute( 'uv', uvAttribute );
    return geom;
}

const charMesh = buildMesh(0.25, 0.5, new Vector3(0.0, 0.0, -4.0));

const loader = new TextureLoader();
const greenManTexture = loader.load("./images/alien.png");

const material = new ShaderMaterial({
    uniforms: {
        "greenMan": { value: greenManTexture }
    },
    vertexShader: `
        out vec2 fragUV;
        
        void main() {
           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
           fragUV = uv;
        }`,
    fragmentShader: `
        uniform sampler2D greenMan;
        
        in vec2 fragUV;

        void main(){
            gl_FragColor = texture(greenMan, fragUV);
            if (gl_FragColor.a < 1.0) discard;
        }`
});

const object = new Mesh(charMesh, material);
scene.add(object);

document.body.appendChild( VRButton.createButton( renderer ) );

const rafCallbacks = new Set();
renderer.setAnimationLoop(function (time) {
    TWEEN.update(time);
    rafCallbacks.forEach(cb => cb(time));
    renderer.render(scene, camera);
});

export {
    renderer,
    scene,
    rafCallbacks,
    cameraGroup,
    camera
}
