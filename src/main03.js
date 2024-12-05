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
// 新版本没有SphereBufferGeometry
// 设置删除uv，纹理作用于每一个point
sphereGeometry.deleteAttribute('uv')

// const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
// const mesh = new THREE.Mesh(sphereGeometry, material)
// scene.add(mesh)
const pointsMaterial = new THREE.PointsMaterial()
pointsMaterial.size = 0.1
pointsMaterial.color.set(0xfff000)
pointsMaterial.sizeAttenuation = true

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./texture/particles/xh.png')
pointsMaterial.map = texture
pointsMaterial.alphaMap = texture
pointsMaterial.transparent = true
pointsMaterial.depthWrite = false
pointsMaterial.blending = THREE.AdditiveBlending
pointsMaterial.vertexColors = true

const points = new THREE.Points(sphereGeometry, pointsMaterial)
// scene.add(points)

const particleGeometry = new THREE.BufferGeometry()
const count = 5000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
  positions[i] = Math.random() * 20 - 10
  colors[i] = Math.random()
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
const points2 = new THREE.Points(particleGeometry, pointsMaterial)
// scene.add(points2)

const params = {
  count: 10000,
  size: 0.1,
  radius: 6,
  branch: 3,
  color: '#ff6030',
  edgeColor: '#1b3984',
  rotateScale: 0.3
}

const centerColor = new THREE.Color(params.color)
const edgeColor = new THREE.Color(params.edgeColor)

let geometry = null
let material = null
const generateGalaxy = () => {
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)

  for (let i = 0; i < params.count; i++) {
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch)
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3)

    const randomX = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
    const randomY = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
    const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5

    const cur = i * 3
    positions[cur] = Math.cos(branchAngel + distance * params.rotateScale) * distance + randomX
    positions[cur + 1] = 0 + randomY
    positions[cur + 2] = Math.sin(branchAngel + distance * params.rotateScale) * distance + randomZ

    const mixColor = centerColor.clone()
    mixColor.lerp(edgeColor, distance / params.radius)

    colors[cur] = mixColor.r
    colors[cur + 1] = mixColor.g
    colors[cur + 2] = mixColor.b
  }

  const texture = new THREE.TextureLoader().load('texture/particles/1.png')
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  material = new THREE.PointsMaterial({
    // color: new THREE.Color(params.color),
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: texture,
    alphaMap: texture,
    transparent: true,
    vertexColors: true
  })
  const points = new THREE.Points(geometry, material)
  return points
}
const starRings = generateGalaxy()
scene.add(starRings)

function render() {
  let time = clock.getElapsedTime()
  starRings.rotation.y = -time * 0.1
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
