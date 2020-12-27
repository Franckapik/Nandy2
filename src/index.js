import { Physics } from '@react-three/cannon'
import { Cone, HTML, Loader, Sky, Stars, Stats, useHelper } from '@react-three/drei'
import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber'
import { Vector3 } from 'yuka'
import Budie from './references/Budie'
import { Cube } from './references/Cube'
import './styles.css'
import CameraTarget from './Tools/CameraTarget'
import { Ground } from './Tools/Ground'
import { Hud } from './Tools/Hud'
import { IA } from './Tools/IA'
import ModalBox from './Tools/ModalBox'
import { Models } from './Tools/Models'
import Vehicle from './Tools/Vehicle'
import { NavMeshRandom } from './Tools/NavMeshRandom'
import useEmpty from './hooks/useEmpty'
import { BoxHelper, Object3D } from 'three'
import VolumetricSpotlight from "./Tools/volumetric-spotlight";
import * as THREE from "three"

extend({
  VolumetricSpotlight
});


const Light = (props) => {
  const { scene } = useThree()
  console.log(scene)
  const lightPos = useEmpty('origin1Light')
  window.scene = scene
  const spotlight = useRef()
  const vs = useRef();

  useEffect(() => {
    const geometry = vs.current.geometry;

console.log(geometry);
  }, []);

  useLayoutEffect(() => {
    const lookAtTarget = scene.getObjectByName('Chassis')
    spotlight.current.target = lookAtTarget
    //vs.current.material.uniforms.lightColor.value = spotlight.current.color; //Change colors to Spotlight colors
  }, [])

  return (
    <>
    <mesh ref={vs} position={lightPos}  >
    <coneGeometry args={[10, 30, 40, 30, 40, true]} attach="geometry" /> //radius, height, nb faces
    {/* <meshBasicMaterial color={'yellow'} transparent opacity={0.5} /> */}
            <volumetricSpotlight
          attach="material"
          uniforms-lightColor-value='yellow'
          uniforms-attenuation-value={200}
          uniforms-anglePower-value={6}
        />
      </mesh>
      <ambientLight intensity={0.02} />
      <spotLight ref={spotlight} position={lightPos} angle={0.8} penumbra={1} intensity={0.4} color="white" castShadow />
    </>
  )
}

const App = (props) => {
  const [events, setEvents] = useState()
  const domContent = useRef()

  return (
    <>
      <Canvas
        id="canvas"
        shadowMap
        gl={{ alpha: false }}
        onCreated={({ gl, events }) => {
          // Export canvas events, we will put them onto the scroll area
          setEvents(events)
        }}>
        <CameraTarget />
        <HTML center portal={domContent}>
          <div style={{ top: '2.55rem', fontSize: '2em', top: '4rem' }}>Hello</div>
        </HTML>
        <Stars
          radius={100} // Radius of the inner sphere (default=100)
          depth={50} // Depth of area where stars should fit (default=50)
          count={5000} // Amount of stars (default=5000)
          factor={4} // Size factor (default=4)
          saturation={0} // Saturation 0-1 (default=0)
          fade // Faded dots (default=false)
        />

        <Physics>
          <IA />
          <NavMeshRandom urlnav={'/navmesh_applied.glb'} urlGltf={'./traversant.glb'} max={1000} nameMesh={'Herb'} />
          <Models />
          <Vehicle position={[-5, 5, 5]} rotation={[0, -Math.PI * 1.2, 0]} angularVelocity={[0, 0.5, 0]} />
          <Ground mode="basic" scale={1} parallaxFactor={-0.2} minLayers={8} maxLayers={30} />
          <Cube name="box1" position={[-70, 0, 45]} />
          <Light />
        </Physics>
      </Canvas>
      <Stats />
      <Loader />
      <Suspense fallback="null">
        <ModalBox title={'Bienvenue sur Nature&You'} startup={false} />
        <div className="frontDiv" {...events} ref={domContent}>
          <Hud />
        </div>
      </Suspense>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
