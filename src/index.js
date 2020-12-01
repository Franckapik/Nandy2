import { Physics, usePlane } from '@react-three/cannon'
import { Loader, Sky, Stats, useGLTF, useTexture } from '@react-three/drei'
import React, { Suspense, useRef } from 'react'
import ReactDOM from 'react-dom'
import * as THREE from 'three'
import useStore from './store'
import './styles.css'
import CameraTarget from './Tools/CameraTarget'
import Vehicle from './Tools/Vehicle'
import { Canvas } from 'react-three-fiber'
import ParallaxMapMaterial from './Tools/parallaxMap'
import ModalBox from './Tools/ModalBox'
import { Model } from './Tools/Model'
import { useMatcaps } from './hooks/useMatcaps'
import { Hud } from './Tools/Hud'
import { Cube } from './references/Cube'

const Models = (props) => {
  const matcaps = useMatcaps('./matcaps/512/') //load just once
  return (
    <>
      <Model matcaps={matcaps} url={'/passive.gltf'} mass={0} />
      <Model matcaps={matcaps} url={'/active.gltf'} mass={10} />
    </>
  )
}

function Plane({ minLayers, maxLayers, parallaxFactor, mode, scale }) {
  const [map, bumpMap] = useTexture(['/textures/floor3.png', '/textures/floorbump.jpg'])

  map.wrapS = THREE.RepeatWrapping
  map.wrapT = THREE.RepeatWrapping
  map.offset.set(0, 0)
  map.repeat.set(1500, 1500)
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }))

  return (
    <mesh ref={ref} receiveShadow ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[200, 200]} />
      <ParallaxMapMaterial map={map} bumpMap={bumpMap} mode={mode} parallaxScale={parallaxFactor} parallaxMinLayers={minLayers} parallaxMaxLayers={maxLayers} />
    </mesh>
  )
}

ReactDOM.render(
  <>
    <Suspense fallback="null">
      <Hud />
      <ModalBox title={'Bienvenue sur Nature&You'} />
    </Suspense>
    <Canvas id="canvas" shadowMap gl={{ alpha: false }}>
      <CameraTarget />
      <hemisphereLight intensity={0.35} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
      <Sky
        distance={3000}
        turbidity={2}
        rayleigh={4}
        mieCoefficient={0.038}
        mieDirectionalG={0.85}
        sunPosition={[Math.PI, -10, 0]}
        exposure={5}
        azimuth={0.5}
      />
      <Suspense fallback={null}></Suspense>
      <Physics>
        <Models />
        <Vehicle position={[-5, 5, 5]} rotation={[0, -Math.PI * 1.2, 0]} angularVelocity={[0, 0.5, 0]} />
        <Plane mode="basic" scale={1} parallaxFactor={-0.2} minLayers={8} maxLayers={30} />
        <Cube />
      </Physics>
    </Canvas>

    <Loader />
  </>,
  document.getElementById('root')
)
