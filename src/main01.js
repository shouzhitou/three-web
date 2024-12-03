import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// console.log(THREE);

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
// webgl渲染的canvas添加到body
document.body.appendChild(renderer.domElement)
// 渲染器渲染场景

// 轨道控制器 (只声明就能转动页面)
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，需要调用update
controls.enableDamping = true

// 添加坐标轴
// const axesHelper = new THREE.AxesHelper(5)
// axesHelper.setColors('red', 'pink', 'yellow')
// scene.add(axesHelper)

const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.load([
  'texture/environmentMaps/2/px.jpg',
  'texture/environmentMaps/2/nx.jpg',
  'texture/environmentMaps/2/py.jpg',
  'texture/environmentMaps/2/ny.jpg',
  'texture/environmentMaps/2/pz.jpg',
  'texture/environmentMaps/2/nz.jpg'
])

const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('texture/hdr/002.hdr').then(texture => {
  texture.mapping = THREE.EquirectangularRefractionMapping
  scene.environment = texture
  scene.background = texture
})

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.1
  // envMap: envMapTexture
})
const sphere = new THREE.Mesh(sphereGeometry, material)
scene.add(sphere)

// scene.background = envMapTexture
// scene.environment = envMapTexture

const light = new THREE.AmbientLight('#fff', 0.5)
scene.add(light)

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
