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
camera.position.set(0, 0, 100)
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

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
// window.addEventListener('click', e => {
//   console.log(e)
//   mouse.x = (e.clientX / window.innerWidth) * 2 - 1
//   mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
//   raycaster.setFromCamera(mouse, camera)
//   const result = raycaster.intersectObjects(cubeArr)
//   result[0].object.material = redMaterial
// })

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({
  wireframe: true
})
const redMaterial = new THREE.MeshBasicMaterial({ color: 'red' })

const cubeArr = []
let cubeGroup = new THREE.Group()
for (let x = -5; x < 5; x++) {
  for (let y = -5; y < 5; y++) {
    for (let z = -5; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material)
      cube.position.set(x * 2 - 4, y * 2 - 4, z * 2 - 4)

      cubeGroup.add(cube)
      cubeArr.push(cube)
    }
  }
}

scene.add(cubeGroup)

gsap.to(cubeGroup.rotation, {
  x: '+=' + Math.PI * 2,
  y: '+=' + Math.PI * 2,
  duration: 10,
  ease: 'power2.inOut',
  repeat: -1
})

var sjxGroup = new THREE.Group()
for (let i = 0; i < 50; i++) {
  // 每一个三角形，需要3个顶点，每个顶点需要3个值
  const geometry = new THREE.BufferGeometry()
  const positionArray = new Float32Array(9)
  for (let j = 0; j < 9; j++) {
    if (j % 3 == 1) {
      positionArray[j] = Math.random() * 10 - 5
    } else {
      positionArray[j] = Math.random() * 10 - 5
    }
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
  let color = new THREE.Color(Math.random(), Math.random(), Math.random())
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  })
  // 根据几何体和材质创建物体
  let sjxMesh = new THREE.Mesh(geometry, material)
  //   console.log(mesh);
  sjxGroup.add(sjxMesh)
}
sjxGroup.position.set(0, -30, 0)
scene.add(sjxGroup)

gsap.to(sjxGroup.rotation, {
  x: '-=' + Math.PI * 2,
  z: '+=' + Math.PI * 2,
  duration: 2,
  ease: 'power2.inOut',
  repeat: -1
})

const sphereGroup = new THREE.Group()
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const spherematerial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  color: '#ff0000'
})
const sphere = new THREE.Mesh(sphereGeometry, spherematerial)
// 投射阴影
sphere.castShadow = true
sphereGroup.add(sphere)

// // 创建平面
const planeGeometry = new THREE.PlaneGeometry(20, 20)
const plane = new THREE.Mesh(planeGeometry, spherematerial)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
// 接收阴影
plane.receiveShadow = true
sphereGroup.add(plane)

const light = new THREE.AmbientLight(0xffffff, 0.5) // soft white light
sphereGroup.add(light)

const smallBall = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
smallBall.position.set(2, 2, 2)

const pointLight = new THREE.PointLight(0xff0000, 3)
// pointLight.position.set(2, 2, 2);
pointLight.castShadow = true
// 设置阴影贴图模糊度
pointLight.shadow.radius = 20
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(512, 512)

smallBall.add(pointLight)
sphereGroup.add(smallBall)

sphereGroup.position.set(0, -60, 0)
scene.add(sphereGroup)

gsap.to(smallBall.position, {
  x: -3,
  duration: 6,
  ease: 'power2.inOut',
  repeat: -1,
  yoyo: true
})
gsap.to(smallBall.position, {
  y: 0,
  duration: 0.5,
  ease: 'power2.inOut',
  repeat: -1,
  yoyo: true
})

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

let arrGroup = [cubeGroup, sjxGroup, sphereGroup]
let currentPage = 0
// 监听滚动事件
window.addEventListener('scroll', () => {
  //   console.log(window.scrollY);
  const newPage = Math.round(window.scrollY / window.innerHeight)
  if (newPage != currentPage) {
    currentPage = newPage
    console.log('改变页面，当前是：' + currentPage)
    console.log(arrGroup[currentPage].rotation)
    gsap.to(arrGroup[currentPage].rotation, {
      z: '+=' + Math.PI * 2,
      x: '+=' + Math.PI * 2,
      duration: 2,
      onComplete: () => {
        console.log('旋转完成')
      }
    })

    // gsap.to(`.page${currentPage} h1`, {
    //   rotate: "+=360",
    //   duration: 1,
    // });
    gsap.fromTo(`.page${currentPage} h1`, { x: -300 }, { x: 0, rotate: '+=360', duration: 1 })
  }
})
