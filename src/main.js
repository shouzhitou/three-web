import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import basicVertexShader from './shader/deep/vertex.glsl'
import basicFragmentShader from './shader/deep/fragment.glsl'
// console.log(THREE);
const clock = new THREE.Clock()
const gui = new dat.GUI()

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
// 相机位置
camera.position.set(0, 0, 2)
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
const texture = textureLoader.load('./texture/ca.jpeg')
const params = {
  uFrequency: 10,
  uScale: 0.1
}

// const material = new THREE.MeshBasicMaterial({ color: '#00ff00' })
// const shaderMaterial = new THREE.ShaderMaterial({
//   vertexShader: basicVertexShader,
//   fragmentShader:  basicFragmentShader
// })

const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: basicFragmentShader,
  // wireframe: true,
  uniforms: {
    uColor: {
      value: new THREE.Color('purple')
    },
    // 波浪的频率
    uFrequency: {
      value: params.uFrequency
    },
    // 波浪的幅度
    uScale: {
      value: params.uScale
    },
    // 动画时间
    uTime: {
      value: 0
    },
    uTexture: {
      value: texture
    }
  },
  side: THREE.DoubleSide,
  transparent: true
})

gui
  .add(params, 'uFrequency')
  .min(0)
  .max(50)
  .step(0.1)
  .onChange(value => {
    rawShaderMaterial.uniforms.uFrequency.value = value
  })
gui
  .add(params, 'uScale')
  .min(0)
  .max(1)
  .step(0.01)
  .onChange(value => {
    rawShaderMaterial.uniforms.uScale.value = value
  })

const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), rawShaderMaterial)
scene.add(floor)
console.log(floor)

function render() {
  const elapsedTime = clock.getElapsedTime()
  // rawShaderMaterial.uniforms.uTime.value = elapsedTime
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
