import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// console.log(THREE);

// 1、材质要满足能够对光照有反应
// 2、设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true;
// 3、设置光照投射阴影 directionalLight.castShadow = true;
// 4、设置物体投射阴影 sphere.castShadow = true;
// 5、设置物体接收阴影 plane.receiveShadow = true;

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 相机位置
camera.position.set(0, 0, 10)
scene.add(camera)

const event = {
  onLoad(e) {
    console.log('加载完成', e)
  },
  onProgress(url, num, total) {
    console.log('加载进度', url, num, total)
  },
  onError(e) {
    console.log('加载报错', e)
  }
}

const loadManager = new THREE.LoadingManager(event.onLoad, event.onProgress, event.onError)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
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

// const cubeTextureLoader = new THREE.CubeTextureLoader()
// const envMapTexture = cubeTextureLoader.load([
//   'texture/environmentMaps/2/px.jpg',
//   'texture/environmentMaps/2/nx.jpg',
//   'texture/environmentMaps/2/py.jpg',
//   'texture/environmentMaps/2/ny.jpg',
//   'texture/environmentMaps/2/pz.jpg',
//   'texture/environmentMaps/2/nz.jpg'
// ])

// const rgbeLoader = new RGBELoader()
// rgbeLoader.loadAsync('texture/hdr/002.hdr').then(texture => {
//   texture.mapping = THREE.EquirectangularRefractionMapping
//   scene.environment = texture
//   scene.background = texture
// })

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
  // metalness: 0.7,
  // roughness: 0.1
  // envMap: envMapTexture
  // side: THREE.DoubleSide
})
const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.castShadow = true
scene.add(sphere)

// scene.background = envMapTexture
// scene.environment = envMapTexture

const planeGeometry = new THREE.PlaneGeometry(50, 50, 1, 1)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
scene.add(plane)

const light = new THREE.AmbientLight(0xffffff, 0.5) // 柔和的白光
scene.add(light)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// directionalLight.position.set(10, 10, 10)
// directionalLight.castShadow = true
// directionalLight.shadow.radius = 20
// directionalLight.shadow.mapSize.set(2048, 2048)
// scene.add(directionalLight)

// const spotLight = new THREE.SpotLight(0xffffff, 10)
// spotLight.position.set(3, 3, 3)
// spotLight.castShadow = true
// spotLight.shadow.mapSize.set(2048, 2048)
// spotLight.angle = Math.PI / 4
// spotLight.target = sphere
// scene.add(spotLight)

const smallBall = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
smallBall.position.set(2, 2, 2)

const pointLight = new THREE.PointLight(0xffffff, 10)
//
pointLight.castShadow = true
pointLight.shadow.mapSize.set(2048, 2048)
// spotLight.angle = Math.PI / 4
// pointLight.target = sphere

smallBall.add(pointLight)

scene.add(smallBall)

const gui = new dat.GUI()
console.log(sphere)

// gui.add(sphere.position, 'x').min(0).max(10).step(0.1)
// gui
//   .add(spotLight, 'angle')
//   .min(0)
//   .max(Math.PI / 2)
//   .step(0.1)

const clock = new THREE.Clock()

function render() {
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01

  // cube.scale.x += 0.01
  // cube.scale.y += 0.01
  // 时钟运行总时长
  // let time = clock.getElapsedTime()
  // console.log('time: ', time)
  // // 两次获取时间的间隔时间
  // let deltaTime = clock.getDelta()
  // console.log('deltaTime: ', deltaTime)

  let time = clock.getElapsedTime()
  smallBall.position.x = Math.sin(time) * 3
  smallBall.position.z = Math.cos(time) * 3
  controls.update()
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

// 图形界面更改变量，移动选项需要物体静止
// const gui = new dat.GUI()
// gui
//   .add(cube.position, 'x')
//   .min(0)
//   .max(5)
//   .step(0.01)
//   .name('xAxis')
//   .onChange(val => console.log(val))
//   .onFinishChange(val => console.log('完全停下来'))
// 修改颜色
// const params = {
//   color: '#ff0000',
//   fn: () => {
//     gsap.to(cube.position, { x: 5, y: 5, z: 5, duration: 5, repeat: -1, yoyo: true, ease: 'power1.inOut' })
//   }
// }
// gui.addColor(params, 'color').onChange(val => {
//   console.log(val)
//   cube.material.color.set(val)
// })
// gui.add(cube, 'visible').name('display')
// gui.add(params, 'fn').name('start')

// const folder = gui.addFolder('设置立方体')
// folder.add(cube.material, 'wireframe')
// const folder2 = gui.addFolder('文件夹')
