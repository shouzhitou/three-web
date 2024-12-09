import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import * as CANNON from 'cannon-es'
// console.log(THREE);
const clock = new THREE.Clock()
const gui = new dat.GUI()

console.log(CANNON)

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300)
// 相机位置
camera.position.set(0, 0, 40)
scene.add(camera)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
// webgl渲染的canvas添加到body
document.body.appendChild(renderer.domElement)
// 渲染器渲染场景

// 轨道控制器 (只声明就能转动页面)
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，需要调用update
controls.enableDamping = true

// 添加坐标轴
const axesHelper = new THREE.AxesHelper(5)
axesHelper.setColors('red', 'green', 'blue')
scene.add(axesHelper)

// 创建球和平面
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.castShadow = true
// scene.add(sphere)

// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// const cubeMaterial = new THREE.MeshBasicMaterial()
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// cube.castShadow = true
// scene.add(cube)

const cubeArr = [];
const cubeWorldMaterial = new CANNON.Material("cube");
const hitSound = new Audio('assets/metalHit.mp3')
function createCube() {
  // 创建立方体和平面
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial();
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  scene.add(cube);
  // 创建物理cube形状
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));

  // 创建物理世界的物体
  const cubeBody = new CANNON.Body({
    shape: cubeShape,
    position: new CANNON.Vec3(0, 0, 0),
    //   小球质量
    mass: 1,
    //   物体材质
    material: cubeWorldMaterial,
  });
  // 物体反作用力
  cubeBody.applyLocalForce(
    new CANNON.Vec3(300, 0, 0), //添加的力的大小和方向
    new CANNON.Vec3(0, 0, 0) //施加的力所在的位置
  );

  // 将物体添加至物理世界
  world.addBody(cubeBody);
  // 添加监听碰撞事件
  function HitEvent(e) {
    // 获取碰撞的强度
    //   console.log("hit", e);
    const impactStrength = e.contact.getImpactVelocityAlongNormal();
    console.log(impactStrength);
    if (impactStrength > 2) {
      //   重新从零开始播放
      hitSound.currentTime = 0;
      hitSound.volume = impactStrength / 12;
      hitSound.play();
    }
  }
  cubeBody.addEventListener("collide", HitEvent);
  cubeArr.push({
    mesh: cube,
    body: cubeBody,
  });
}

window.addEventListener("click", createCube);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial())
floor.position.set(0, -5, 0)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

//添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
dirLight.castShadow = true
scene.add(dirLight)

const world = new CANNON.World()
world.gravity.set(0, -9.8, 0)

const sphereShape = new CANNON.Sphere(1)
const sphereWorldMaterial = new CANNON.Material({ id: 'sphere' })

const sphereBody = new CANNON.Body({
  shape: sphereShape,
  position: new CANNON.Vec3(0, 0, 0),
  mass: 1,
  material: sphereWorldMaterial
})
// world.addBody(sphereBody)

// vec3里 cubeGeoetry的一半， 理由没说
// const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
// const cubeWorldMaterial = new CANNON.Material("cube");
// const cubeBody = new CANNON.Body({
//   shape: cubeShape,
//   position: new CANNON.Vec3(0, 0, 0),
//   //   小球质量
//   mass: 1,
//   //   物体材质
//   material: cubeWorldMaterial,
// });
// world.addBody(cubeBody)

// const hitSound = new Audio('assets/metalHit.mp3')
// function hitEvent(e) {
//   console.log(e);
//   const impactStrength = e.contact.getImpactVelocityAlongNormal()
//   console.log(impactStrength);
//   if (impactStrength > 2) {
//     hitSound.currentTime = 0
//     hitSound.play()
//   }
// }
// sphereBody.addEventListener('collide', hitEvent)

// cubeBody.addEventListener('collide', hitEvent)

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
const floorMaterial = new CANNON.Material({ id: 'floor' })
floorBody.material = floorMaterial
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.position.set(0, -5, 0)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(floorBody)

const defaultContactMaterial = new CANNON.ContactMaterial(sphereWorldMaterial, floorMaterial, {
  id: 'defaultContactMaterial',
  friction: 0.1,
  restitution: 0.7
})

world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial;

function render() {
  const deltaTime = clock.getDelta()
  world.step(1/120, deltaTime)
  // sphere.position.copy(sphereBody.position)
  // cube.position.copy(cubeBody.position)
  cubeArr.forEach((item) => {
    item.mesh.position.copy(item.body.position);
    // 设置渲染的物体跟随物理的物体旋转
    item.mesh.quaternion.copy(item.body.quaternion);
  });
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

render()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
})

