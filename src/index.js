import { Physics } from '@react-three/cannon'
import { HTML, Loader, Sky, useGLTF } from '@react-three/drei'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useFrame } from 'react-three-fiber'
import { Vector3 } from 'yuka'
import { useNavLoader } from './hooks/useNavLoader'
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
import * as THREE from 'three'  

/* function Pave({xa, ya, za, position, number}) {
  const tempObject = new THREE.Object3D()
  const gltf = useGLTF('./pave.glb')
  const geometry = gltf.nodes.pave.geometry

  console.log(geometry);
  React.useMemo(() => {
    geometry.computeVertexNormals()
    geometry.scale(0.5, 0.5, 0.5)
  }, [geometry])

  const ref = useRef()

  useFrame((state) => {
    let i = 0
    for (let x = 0; x < xa; x++)
      for (let y = 0; y < ya; y++)
        for (let z = 0; z < za; z++) {
          const id = i++
          tempObject.position.set(- x, - y, - z)
          const scale = 1
          tempObject.rotation.x = -Math.PI/2;
          tempObject.scale.set(scale, scale, scale)
          tempObject.updateMatrix()
          ref.current.setMatrixAt(id, tempObject.matrix)
        }
    ref.current.instanceMatrix.needsUpdate = true
  })
  
  const args = React.useMemo(() => [geometry, null, number], [geometry])

  //how is it possible to instance a iport gltf ?

  return (
    <instancedMesh position={position} ref={ref} args={args} rotation= {[0, 0, 0]} >
      <meshNormalMaterial attach="material" />
    </instancedMesh>
  )
} */

const NavMeshRandom = (props) => {
  const [arrayRegions, setArrayRegions] = useState([]);
  const [navMesh, random] = useNavLoader('/navmesh_applied.glb', 10000)
  const tempObject = new THREE.Object3D()
  const gltf = useGLTF('./pilar.glb')
  const geometry = gltf.nodes.Pilar.geometry;

  React.useMemo(() => {
    geometry.computeVertexNormals()
    geometry.scale(0.5, 0.5, 0.5)
  }, [geometry])

  useEffect(() => {
    setArrayRegions(navMesh.regions)
    console.log(arrayRegions);
  })
  const ref = useRef()

  useFrame((state) => {
    let i = 0
    for (let x = 0; x < 10; x++)
      for (let y = 0; y < 10; y++)
        for (let z = 0; z < 10; z++) {
          const id = i++
          tempObject.position.set(- x, - y, - z)
          const scale = 1
          tempObject.rotation.x = -Math.PI/2;
          tempObject.scale.set(scale, scale, scale)
          tempObject.updateMatrix()
          ref.current.setMatrixAt(id, tempObject.matrix)
        }
    ref.current.instanceMatrix.needsUpdate = true
  })
  
  const args = React.useMemo(() => [geometry, null, 100], [geometry])

  //how is it possible to instance a iport gltf ?

  return (
    <instancedMesh ref={ref} args={args} rotation= {[0, 0, 0]} >
      <meshNormalMaterial attach="material" />
    </instancedMesh>
  )
/* 

  return (
    arrayRegions.map( 
      (a, i) => {
      const offset = Math.floor(Math.random() * 3) + 1  
      return <Cube position={[a.centroid.x +offset, a.centroid.y, a.centroid.z+offset]}  />
    })
  ) */
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
        <HTML center portal={domContent}>
          <div style={{ top: '2.55rem', fontSize: '2em', top: '4rem' }} >Hello</div>
        </HTML>

        <Physics>
        <IA/>
        <NavMeshRandom />
          <Models />
          <Vehicle position={[-5, 5, 5]} rotation={[0, -Math.PI * 1.2, 0]} angularVelocity={[0, 0.5, 0]} />
          <Ground mode="basic" scale={1} parallaxFactor={-0.2} minLayers={8} maxLayers={30} />
          <Cube />
        </Physics>
      </Canvas>
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

