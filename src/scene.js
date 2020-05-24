import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {
    Face3,
    Geometry,
    Group,
    Mesh,
    ShaderMaterial,
    PerspectiveCamera,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer, Color
} from 'three';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
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

if ( WEBGL.isWebGL2Available() === false ) {
    document.body.appendChild( WEBGL.getWebGL2ErrorMessage() );
}

const geom = new Geometry();
const v1 = new Vector3(-4, -4, -10);
const v2 = new Vector3(-4, 4, -10);
const v3 = new Vector3(4, 4, -10);
const v4 = new Vector3(4, -4, -10);

geom.vertices.push(v1);
geom.vertices.push(v2);
geom.vertices.push(v3);
geom.vertices.push(v4);

geom.faces.push( new Face3( 0, 2, 1 ));
geom.faces.push( new Face3( 0, 3, 2 ));

geom.faces[0].vertexColors.push(new Color(1.0, 0.0, 0.0));
geom.faces[0].vertexColors.push(new Color(0.0, 1.0, 0.0));
geom.faces[0].vertexColors.push(new Color( 0.0, 1.0, 1.0));
geom.faces[1].vertexColors.push(new Color(1.0, 0.0, 0.0));
geom.faces[1].vertexColors.push(new Color(0.0, 1.0, 0.0));
geom.faces[1].vertexColors.push(new Color( 0.0, 1.0, 1.0));

geom.faceVertexUvs[0].push( [ new Vector2(0.0, 0.0), new Vector2( 1.0, 1.0), new Vector2(0.0, 1.0) ]);
geom.faceVertexUvs[0].push( [ new Vector2(0.0, 0.0), new Vector2( 1.0, 0.0), new Vector2(1.0, 1.0) ]);

const material = new ShaderMaterial({
    vertexShader: `
        #version 300 es 
        
        out vec2 fragUV;
        
        void main() {
           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
           fragUV = uv;
        }`,
    fragmentShader: `
        #version 300 es 
        
        in vec2 fragUV;
        out vec4 outColor;

        void main(){
            outColor = vec4(fragUV, 0.0, 1.0);
        }`
});

const object = new Mesh(geom, material);
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
