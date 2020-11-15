import ReactDOM from 'react-dom'
import React, { Suspense } from "react";
import {Loader, Sky } from "drei";
import { Canvas } from 'react-three-fiber'
import FPSStats from "react-fps-stats";
import { Physics, usePlane, useBox } from 'use-cannon'
import useStore from './store';
import './styles.css'


function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1009, 1000]} />
      <shadowMaterial attach="material" color="#171717" />
    </mesh>
  )
}

function Cube(props) {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], rotation: [0.4, 0.2, 0.5], ...props }))
  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="hotpink" />
    </mesh>
  )
}

ReactDOM.render(
  <>
  <FPSStats />
  <Canvas shadowMap gl={{ alpha: false }} camera={{ position: [-1, 2, 5], fov: 50 }}>
  <Suspense fallback={null}>
    <color attach="background" args={['lightblue']} />
    <hemisphereLight intensity={0.35} />
    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
    <Sky
        distance={3000} 
        turbidity={2} 
        rayleigh={4} 
        mieCoefficient={0.038} 
        mieDirectionalG={0.85} 
        sunPosition={[Math.PI, -10, 0]}
        exposure = {5}
        azimuth={0.5}
        />
    <Physics>
      <Plane />
      <Cube />
      <Cube position={[0, 10, -2]} />
      <Cube position={[0, 20, -2]} />
    </Physics>
    </Suspense>
  </Canvas>
  <Loader />
  </>,
  document.getElementById('root')
)
