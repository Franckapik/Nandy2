import ReactDOM from 'react-dom'
import React, { Suspense, useRef } from "react";
import {Loader, Sky, useGLTF, useMatcapTexture, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from 'react-three-fiber'
import FPSStats from "react-fps-stats";
import { Physics, usePlane, useBox } from '@react-three/cannon'
import CameraTarget from './Tools/CameraTarget'
import './styles.css'
import { ParallaxMapMaterial } from './Tools/parallaxMap'


function Box({minLayers, maxLayers, parallaxFactor, mode, scale}) {
  const mesh = useRef()
  /* 
  ParallaxMap ordered from fastest to best quality.
  const modes = {
    none
    basic
    steep
    occlusion // a.k.a. POM
    relief
  } */

  const [map, bumpMap] = useTexture(['/textures/brick_diffuse.jpg', '/textures/brick_bump.jpg'])

  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.0025
  })
  return (
    <mesh ref={mesh} scale={[scale, scale, scale]}>
      <boxBufferGeometry args={[4.25, 4.25, 4.25]} />
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


//threejs : https://threejs.org/examples/?q=map#webgl_materials_parallaxmap
//imagefader drei slmt : https://codesandbox.io/s/t9-react-three-fiber-shadermaterial-1g4qq?from-embed=&file=/src/ImageFadeMaterial.js
//glsl babel + drei: https://codesandbox.io/s/r3f-shader-material-yltgr?file=/src/App.js
//codesandbox pour test : https://codesandbox.io/s/r3f-basic-demo-forked-cegg8?file=/src/App.js


 //const preloaded = useGLTF.preload('/pilar.glb')
//console.log(preloaded);
//or maybe useLoader.preload(GLTFLoader, url)

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
  console.log(pos1);


   
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


function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1009, 1000]} />
      <meshLambertMaterial attach="material" color="hotpink" />
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
      <Asset url="/passive_z1_draco.gltf" />
      <AssettoMesh url="/pilar.glb" />
      <Box mode='relief' scale={2} parallaxFactor={-0.12} minLayers={8} maxLayers={30} />

    </Suspense>
    <Physics>
      <Plane />
      <Cube />
      <Cube position={[0, 10, -2]} />
      <Cube position={[0, 20, -2]} />
    </Physics>
    
  </Canvas>
  <Loader />
  </>,
  document.getElementById('root')
)
