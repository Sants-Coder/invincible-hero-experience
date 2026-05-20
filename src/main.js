import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import gsap from 'gsap'

import './style.css'

import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  VignetteEffect,
  ChromaticAberrationEffect,
  BlendFunction
} from 'postprocessing'

import { Vector2 } from 'three'


// ======================================================
// CANVAS
// ======================================================

const canvas = document.createElement('canvas')

canvas.classList.add('webgl')

document.body.appendChild(canvas)


// ======================================================
// SCENE
// ======================================================

const scene = new THREE.Scene()

scene.background = new THREE.Color('#050816')


// ======================================================
// SIZES
// ======================================================

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


// ======================================================
// CAMERA GROUP
// ======================================================

const cameraGroup = new THREE.Group()

scene.add(cameraGroup)


// ======================================================
// CAMERA
// ======================================================

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
)

camera.position.set(
  -1.5,
  0.8,
  13
)

cameraGroup.add(camera)


// ======================================================
// RENDERER
// ======================================================

const renderer = new THREE.WebGLRenderer({

  canvas,

  antialias: true,

  alpha: true

})

renderer.setSize(
  sizes.width,
  sizes.height
)

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
)


// ======================================================
// POSTPROCESSING
// ======================================================

const composer = new EffectComposer(renderer)

const renderPass = new RenderPass(
  scene,
  camera
)

composer.addPass(renderPass)


// ======================================================
// BLOOM
// ======================================================

const bloomEffect = new BloomEffect({

  intensity: 1,

  luminanceThreshold: 0.15,

  luminanceSmoothing: 0.9

})


// ======================================================
// VIGNETTE
// ======================================================

const vignetteEffect = new VignetteEffect({

  eskil: false,

  offset: 0.20,

  darkness: 0.80

})


// ======================================================
// CHROMATIC ABERRATION
// ======================================================

const chromaticEffect =
  new ChromaticAberrationEffect({

    offset: new Vector2(
      0.0004,
      0.0004
    ),

    blendFunction:
      BlendFunction.NORMAL

  })


// ======================================================
// EFFECT PASS
// ======================================================

const effectPass = new EffectPass(

  camera,

  bloomEffect,

  vignetteEffect,

  chromaticEffect

)

composer.addPass(effectPass)


// ======================================================
// LIGHTS
// ======================================================

// AMBIENT

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  0.7
)

scene.add(ambientLight)


// ======================================================
// BLUE LIGHT
// ======================================================

const blueLight = new THREE.PointLight(
  0x3b82f6,
  65,
  100
)

blueLight.position.set(
  -8,
  4,
  -4
)

scene.add(blueLight)


// ======================================================
// YELLOW LIGHT
// ======================================================

const yellowLight = new THREE.PointLight(
  0xffd54f,
  35,
  50
)

yellowLight.position.set(
  4,
  3,
  6
)

scene.add(yellowLight)


// ======================================================
// TOP LIGHT
// ======================================================

const topLight = new THREE.PointLight(
  0xffffff,
  20,
  30
)

topLight.position.set(
  0,
  10,
  4
)

scene.add(topLight)


// ======================================================
// PARTICLES
// ======================================================

const particlesCount = 2000

const positions = new Float32Array(
  particlesCount * 3
)

for (let i = 0; i < particlesCount * 3; i++) {

  positions[i] =
    (Math.random() - 0.5) * 30

}

const particlesGeometry =
  new THREE.BufferGeometry()

particlesGeometry.setAttribute(

  'position',

  new THREE.BufferAttribute(
    positions,
    3
  )

)

const particlesMaterial =
  new THREE.PointsMaterial({

    size: 0.03,

    color: '#ffffff',

    transparent: true,

    opacity: 0.25,

    blending: THREE.AdditiveBlending,

    depthWrite: false

  })

const particles = new THREE.Points(

  particlesGeometry,
  particlesMaterial

)

scene.add(particles)


// ======================================================
// MODEL
// ======================================================

const loader = new GLTFLoader()

let mark = null
let mixer = null

let baseY = -4.5


// ======================================================
// EYES
// ======================================================

const eyeMaterial =
  new THREE.MeshBasicMaterial({

    color: '#ffffff'

  })

const eyeGeometry =
  new THREE.SphereGeometry(
    0.055,
    16,
    16
  )


// LEFT EYE

const leftEye = new THREE.Mesh(
  eyeGeometry,
  eyeMaterial
)


// RIGHT EYE

const rightEye = new THREE.Mesh(
  eyeGeometry,
  eyeMaterial
)


// ======================================================
// EYE LIGHTS
// ======================================================

const leftEyeLight =
  new THREE.PointLight(
    0xffffff,
    1,
    0.70
  )

const rightEyeLight =
  new THREE.PointLight(
    0xffffff,
    1,
    0.70
  )


// ======================================================
// LOAD MODEL
// ======================================================

loader.load(

  '/invincible.glb',

  (gltf) => {

    mark = gltf.scene

    // ==========================================
    // MIXER
    // ==========================================

    mixer = new THREE.AnimationMixer(mark)

    if (gltf.animations.length > 0) {

      const action = mixer.clipAction(
        gltf.animations[0]
      )

      action.play()

    }

    mark.scale.set(
      1.55,
      1.55,
      1.55
    )

    mark.position.set(
      -0.60,
      baseY,
      7
    )

    mark.rotation.x = 0

    mark.rotation.y = -0.31

    mark.rotation.z = 0

    scene.add(mark)

    // ==========================================
    // CINEMATIC INTRO
    // ==========================================

    gsap.to(camera.position, {

      x: 0,
      y: 0,
      z: 9,

      duration: 3.5,

      ease: 'power2.out'

    })


    // SUBTLE ROTATION

    gsap.from(mark.rotation, {

      y: -0.5,

      duration: 3,

      ease: 'power2.out'

    })

    // ==========================================
    // EYE POSITIONS
    // ==========================================

    leftEye.position.set(
      -0.02,
      2.93,
      0.09
    )

    rightEye.position.set(
      0.18,
      2.93,
      0.09
    )

    // ==========================================
    // EYE LIGHTS
    // ==========================================

    leftEyeLight.position.copy(
      leftEye.position
    )

    rightEyeLight.position.copy(
      rightEye.position
    )

    mark.add(leftEyeLight)

    mark.add(rightEyeLight)

    console.log('MODEL LOADED')

  },

  undefined,

  (error) => {

    console.error(error)

  }

)


// ======================================================
// UI
// ======================================================

const title = document.createElement('h1')

title.innerText = 'INVINCIBLE'

title.classList.add('title')

document.body.appendChild(title)


// ======================================================
// BUTTON
// ======================================================

const button = document.createElement('button')

button.innerText = 'about'

button.classList.add('explore-btn')

document.body.appendChild(button)


// ======================================================
// BACK BUTTON
// ======================================================

const backButton = document.createElement('button')

backButton.innerText = 'back'

backButton.classList.add('back-btn')

backButton.style.opacity = '0'
backButton.style.pointerEvents = 'none'

document.body.appendChild(backButton)


// ======================================================
// MODAL
// ======================================================

const modal = document.createElement('div')

modal.classList.add('modal')

modal.innerHTML = `
  <div class="modal-content">

    <h2>Mark Grayson</h2>

    <p>
      Mark Grayson is the son of Nolan Grayson,
      the legendary Omni-Man, and one of Earth's
      most powerful young heroes.

      As his Viltrumite abilities begin to awaken,
      Mark struggles to balance a normal teenage
      life with the overwhelming responsibility of
      becoming something greater than human.

      Behind the suit exists a hero constantly
      divided between identity, morality, family
      and power — trying to understand what it
      truly means to protect a world that suddenly
      feels far more dangerous than he ever imagined.
    </p>

  </div>
`

document.body.appendChild(modal)


// ======================================================
// BUTTON CLICK
// ======================================================

let opened = false

button.addEventListener('click', () => {

  if (!mark || opened) return

  opened = true

  // ==========================================
  // MARK MOVE
  // ==========================================

  gsap.to(mark.position, {

    x: 2.3,
    z: 0,

    duration: 2,

    ease: 'power3.inOut'

  })

  // ==========================================
  // MARK SCALE
  // ==========================================

  gsap.to(mark.scale, {

    x: 2.4,
    y: 2.4,
    z: 2.4,

    duration: 2,

    ease: 'power3.inOut'

  })

  // ==========================================
  // MARK ROTATION
  // ==========================================

  gsap.to(mark.rotation, {

    y: -0.6,
    z: -0.12,

    duration: 2,

    ease: 'power3.inOut'

  })

  // ==========================================
  // CAMERA
  // ==========================================

  gsap.to(camera.position, {

    x: -2.1,
    y: 0,
    z: 12,

    duration: 2,

    ease: 'power3.inOut'

  })

  // ==========================================
  // MODAL
  // ==========================================

  modal.classList.add('active')

  // ==========================================
  // BACK BUTTON SHOW
  // ==========================================

  gsap.to(backButton, {

    opacity: 1,

    duration: 0.5,

    onStart: () => {

      backButton.style.pointerEvents = 'auto'

    }

  })

})


// ======================================================
// BACK BUTTON CLICK
// ======================================================

backButton.addEventListener('click', () => {

  if (!mark || !opened) return

  opened = false

  // ==========================================
  // MARK RESET POSITION
  // ==========================================

  gsap.to(mark.position, {

    x: -0.60,
    z: 7,

    duration: 2,

    ease: 'power3.inOut'

  })

  // ==========================================
  // MARK RESET SCALE
  // ==========================================

  gsap.to(mark.scale, {

    x: 1.55,
    y: 1.55,
    z: 1.55,

    duration: 2,

    ease: 'power3.inOut'

  })

  // ==========================================
  // MARK RESET ROTATION
  // ==========================================

  gsap.to(mark.rotation, {

    y: -0.31,
    z: 0,

    duration: 2,

    ease: 'power3.inOut'

  })

  // ==========================================
  // CAMERA RESET
  // ==========================================

  gsap.to(camera.position, {

    x: 0,
    y: 0,
    z: 9,

    duration: 2,

    ease: 'power3.inOut'

  })

  // ==========================================
  // MODAL CLOSE
  // ==========================================

  modal.classList.remove('active')

  // ==========================================
  // BACK BUTTON HIDE
  // ==========================================

  gsap.to(backButton, {

    opacity: 0,

    duration: 0.5,

    onComplete: () => {

      backButton.style.pointerEvents = 'none'

    }

  })

})


// ======================================================
// PARALLAX
// ======================================================

let mouseX = 0
let mouseY = 0

window.addEventListener('mousemove', (event) => {

  mouseX =
    (event.clientX / sizes.width) - 0.5

  mouseY =
    (event.clientY / sizes.height) - 0.5

})


// ======================================================
// RESIZE
// ======================================================

window.addEventListener('resize', () => {

  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect =
    sizes.width / sizes.height

  camera.updateProjectionMatrix()

  renderer.setSize(
    sizes.width,
    sizes.height
  )

  composer.setSize(
    sizes.width,
    sizes.height
  )

})


// ======================================================
// CLOCK
// ======================================================

const clock = new THREE.Clock()


// ======================================================
// LOOP
// ======================================================

const tick = () => {

  const elapsedTime =
    clock.getElapsedTime()

  // ==========================================
  // FLOATING
  // ==========================================

  if (mark) {

    mark.position.y =
      baseY +
      Math.sin(elapsedTime * 2) * 0.08

  }

  // ==========================================
  // LIGHT PULSE
  // ==========================================

  yellowLight.intensity =
    35 + Math.sin(elapsedTime * 2) * 2

  blueLight.intensity =
    65 + Math.sin(elapsedTime * 1.5) * 2

  // ==========================================
  // EYE PULSE
  // ==========================================

  leftEyeLight.intensity =
    2.5 + Math.sin(elapsedTime * 3) * 0.4

  rightEyeLight.intensity =
    2.5 + Math.sin(elapsedTime * 3) * 0.4

  // ==========================================
  // PARTICLES MOTION
  // ==========================================

  particles.rotation.y =
    elapsedTime * 0.01

  particles.rotation.x =
    elapsedTime * 0.005

  // ==========================================
  // CINEMATIC PARALLAX
  // ==========================================

  cameraGroup.position.x +=
    (mouseX * 0.35 - cameraGroup.position.x) * 0.015

  cameraGroup.position.y +=
    (-mouseY * 0.18 - cameraGroup.position.y) * 0.015

  // ==========================================
  // SUBTLE CHARACTER LOOK
  // ==========================================

  if (mark && !opened) {

    mark.rotation.y +=
      ((-0.31 + mouseX * 0.06) - mark.rotation.y) * 0.01

  }

  // ==========================================
  // MIXER
  // ==========================================

  if (mixer) {

    mixer.update(0.01)

  }

  // ==========================================
  // RENDER
  // ==========================================

  composer.render()

  window.requestAnimationFrame(tick)

}

tick()

// ======================================================
// CUSTOM CURSOR
// ======================================================

const cursor = document.createElement('div')

cursor.classList.add('custom-cursor')

document.body.appendChild(cursor)

let cursorX = window.innerWidth / 2
let cursorY = window.innerHeight / 2

let currentX = cursorX
let currentY = cursorY

window.addEventListener('mousemove', (event) => {

  cursorX = event.clientX
  cursorY = event.clientY

})

const animateCursor = () => {

  currentX += (cursorX - currentX) * 0.15
  currentY += (cursorY - currentY) * 0.15

  cursor.style.transform = `
    translate(
      ${currentX}px,
      ${currentY}px
    )
  `

  requestAnimationFrame(animateCursor)

}

animateCursor()


// ======================================================
// CURSOR HOVER EFFECT
// ======================================================

const hoverElements = [
  button,
  backButton
]

hoverElements.forEach((el) => {

  el.addEventListener('mouseenter', () => {

    cursor.classList.add('active')

  })

  el.addEventListener('mouseleave', () => {

    cursor.classList.remove('active')

  })

})