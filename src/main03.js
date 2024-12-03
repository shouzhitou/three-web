import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// console.log(THREE);
const clock = new THREE.Clock()
const gui = new dat.GUI()

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 相机位置
camera.position.set(0, 0, 10)
scene.add(camera)

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

const sphereGeometry = new THREE.SphereGeometry(3, 20, 20)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
// const mesh = new THREE.Mesh(sphereGeometry, material)
// scene.add(mesh)
const pointsMaterial = new THREE.PointsMaterial()
pointsMaterial.size = 0.05
pointsMaterial.sizeAttenuation = true

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./texture/particles/2.png')
pointsMaterial.map = texture

const points = new THREE.Points(sphereGeometry, pointsMaterial)
scene.add(points)
function render() {
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
