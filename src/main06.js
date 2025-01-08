import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import * as CANNON from 'cannon-es'

import basicVertexShader from './shader/raw/vertex.glsl'
import basicFragmentShader from './shader/raw/fragment.glsl'
// console.log(THREE);
const clock = new THREE.Clock()
const gui = new dat.GUI()

console.log(CANNON)

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300)
// 相机位置
camera.position.set(0, 0, 5)
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
const axesHelper = new THREE.AxesHelper(10)
axesHelper.setColors('red', 'green', 'blue')
scene.add(axesHelper)

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load()
const params = {
  uFrenquency: 10,
  uScale: 0.1
}

// const material = new THREE.MeshBasicMaterial({ color: '#00ff00' })
// const shaderMaterial = new THREE.ShaderMaterial({
//   vertexShader: basicVertexShader,
//   fragmentShader:  basicFragmentShader
// })

const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader
})
const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), rawShaderMaterial)
scene.add(floor)

function render() {
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
