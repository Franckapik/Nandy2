import ReactDOM from 'react-dom'
import React, { Suspense, useRef } from "react";
import {Loader, Sky, useGLTF, useMatcapTexture, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from 'react-three-fiber'
import FPSStats from "react-fps-stats";
import { Physics, usePlane, useBox } from '@react-three/cannon'
import CameraTarget from './Tools/CameraTarget'
import './styles.css'
import { ParallaxMapMaterial } from './Tools/parallaxMap'
import * as THREE from 'three'



function Pave({xa, ya, za, position, number}) {
  const tempObject = new THREE.Object3D()

  const ref = useRef()

  useFrame((state) => {
    let i = 0
    for (let x = 0; x < xa; x++)
      for (let y = 0; y < ya; y++)
        for (let z = 0; z < za; z++) {
          const id = i++
          tempObject.position.set(- x, - y, - z)
          const scale = 1
          tempObject.scale.set(scale, scale, scale)
          tempObject.updateMatrix()
          ref.current.setMatrixAt(id, tempObject.matrix)
        }
    ref.current.instanceMatrix.needsUpdate = true
  })


  return (
    <instancedMesh position={position} ref={ref} args={[null, null, number]}>
      <boxBufferGeometry attach="geometry" args={[0.7, 0.7, 0.7]}>
      </boxBufferGeometry>
      <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
    </instancedMesh>
  )
}

function Asset({ url }) {
  const gltf = useGLTF(url)
  return <primitive object={gltf.scene} />
}

function AssettoMesh({ url }) {
  const { nodes, materials } = useGLTF(url)
  const [matcap, url2] = useMatcapTexture(
    18, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
    1024 // size of the texture ( 64, 128, 256, 512, 1024 )
   )
  //const material = useResource()
  const ref = useRef()
  const pos1 = useEmpty('originMsg')

  return (
    <group>
    <mesh geometry={nodes.Pilar.geometry} position={pos1} />
    <mesh material={materials.Mat} geometry={nodes.PIlar2.geometry}  position={[-8,0,0]} />
    <mesh material={materials.Mat} geometry={nodes.Pilar1.geometry} position={[8,0,0]} />
    </group>
    )
}

function useEmpty(name) {
  const { nodes, materials } = useGLTF('/empty.glb')
  return [nodes[name].position.x,nodes[name].position.y,nodes[name].position.z];
}


function Plane({minLayers, maxLayers, parallaxFactor, mode, scale}) {

  const [map, bumpMap] = useTexture(['/textures/floor1.jpg', '/textures/floorbump.jpg'])

  map.wrapS = THREE.RepeatWrapping;
map.wrapT = THREE.RepeatWrapping;
map.offset.set(0, 0);
map.repeat.set( 1500,1500);

console.log(map);
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0]}))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[200,200]} />
      <ParallaxMapMaterial
        map={map}
        bumpMap={bumpMap}
        mode={mode}
        parallaxScale={parallaxFactor}
        parallaxMinLayers={minLayers}
        parallaxMaxLayers={maxLayers}
      />
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
  <Canvas shadowMap gl={{ alpha: false }} >
  <CameraTarget />
  
    <color attach="background" args={['lightblue']} />
    <hemisphereLight intensity={0.35} />
    <fogExp2 attach="fog" args={['black', 0.03]} />
    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
    <Sky distance={3000} turbidity={2} rayleigh={4} mieCoefficient={0.038} mieDirectionalG={0.85} sunPosition={[Math.PI, -10, 0]} exposure = {5} azimuth={0.5} />
    <Suspense fallback={null}>
     <Pave xa={10} ya={1} za={10} position={[5,0,5]} number={1000} />
    </Suspense>
    <Physics>
      <Cube />
      <Cube position={[0, 10, -2]} />
      <Cube position={[0, 20, -2]} />
    </Physics>
    
  </Canvas>
  <Loader />
  </>,
  document.getElementById('root')
)
