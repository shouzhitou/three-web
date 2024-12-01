import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
// console.log(THREE);

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 相机位置
camera.position.set(0, 0, 10)
scene.add(camera)
// 添加物体
const cubeGeometry = new THREE.BoxGeometry()
const cubeMeterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const cube = new THREE.Mesh(cubeGeometry, cubeMeterial)
cube.position.x = 0
scene.add(cube)

// BufferGeometry
// const geometry = new THREE.BufferGeometry()
// const vertices = new Float32Array([
//   -1.0, -1.0, 1.0,
//   1.0, -1.0, 1.0,
//   1.0, 1.0, 1.0,
//   1.0, 1.0,1.0,
//   -1.0, 1.0, 1.0,
//   -1.0, -1.0, 1.0,
// ])
// geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
// const material = new THREE.MeshBasicMaterial({ color: '#eee' })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

for (let i = 0; i < 30; i++) {
  const geometry = new THREE.BufferGeometry()
  const vertices = new Float32Array(9)
  for (let j = 0; j < 9; j++) {
    vertices[j] = Math.random() * 5  
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  const color = new THREE.Color(Math.random(), Math.random(), Math.random())
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5})
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
}





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
const axesHelper = new THREE.AxesHelper(5)
axesHelper.setColors('red', 'pink', 'yellow')
scene.add(axesHelper)

const animate1 = gsap.to(cube.position, { x: 5, y: 5, z: 5, duration: 5, repeat: -1, yoyo: true, ease: 'power1.inOut', onStart: () => {
  console.log('动画开始');
} })

window.addEventListener('dblclick', () => {
  // 动画停止与恢复
  if (animate1.isActive()) {
    animate1.pause()
  } else {
    animate1.resume()
  }
  // 全屏
  // const fullScreenElement = document.fullscreenElement
  // if (fullScreenElement) {
  //   document.exitFullscreen()
  // } else {
  //   renderer.domElement.requestFullscreen()
  // }
})

// const clock = new THREE.Clock()

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
const  gui = new dat.GUI()
gui.add(cube.position, 'x').min(0).max(5).step(0.01).name('xAxis').onChange(val => console.log(val)).onFinishChange(val => console.log('完全停下来'))
// 修改颜色
const params = {
  color: '#ff0000',
  fn: () => {
    gsap.to(cube.position, { x: 5, y: 5, z: 5, duration: 5, repeat: -1, yoyo: true, ease: 'power1.inOut' })
  }
}
gui.addColor(params, 'color').onChange(val => {
  console.log(val)
  cube.material.color.set(val)
})
gui.add(cube, 'visible').name('display')
// gui.add(params, 'fn').name('start')

const folder = gui.addFolder('设置立方体')
folder.add(cube.material, 'wireframe')
const folder2 = gui.addFolder('文件夹')