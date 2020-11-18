import ReactDOM from 'react-dom'
import React, { Suspense, useRef } from "react";
import {Loader, Sky, useGLTF, useMatcapTexture } from "@react-three/drei";
import { Canvas, useFrame } from 'react-three-fiber'
import FPSStats from "react-fps-stats";
import { Physics, usePlane, useBox } from '@react-three/cannon'
import CameraTarget from './Tools/CameraTarget'
import './styles.css'
import * as THREE from 'three'
import Vehicle from './Tools/Vehicle'


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
  const m1 = new THREE.MeshMatcapMaterial({matcap : matcap})
  const pos1 = useEmpty('originMsg')
   
  return (
    <group>
    <mesh material={m1} geometry={nodes.Pilar.geometry} position={pos1} />
    <mesh material={materials.Mat} geometry={nodes.PIlar2.geometry}  position={[-8,0,0]} />
    <mesh material={materials.Mat} geometry={nodes.Pilar1.geometry} position={[8,0,0]} />
    </group>
    )
}



export function Passive({url}) {
  const { nodes, materials } = useGLTF(url)
  console.log('Reading glb file : ',url);
  const first = Object.keys(nodes)
  return (
    Object.entries(nodes).map(
      ([name, obj]) => {
        let bound = [2,2,2];
        if(obj.type==='Group' && obj.name !== first[0]) {
          return (<GroupMesh mass={0} key={name} position={obj.getWorldPosition()} {...obj} />)
        }

        else if(obj.type==='Mesh') { //Mesh seul
          if(obj.parent.name===first[0]) {
            obj.geometry.computeBoundingBox()
            const b = obj.geometry.boundingBox;
            bound = [b.max.x, b.max.y, b.max.z]
            return <ObjMesh mass={0} display={true} key={name} bound={bound} {...obj} position={obj.getWorldPosition()}  />  
          }
        }
        else {
//do nothing
        }  
        return null       //a verifier si erreur
    }
  )
  )
}


const ObjMesh = ({position,bound,display,mass,...props}) => {

  const v = position;

  const [cube] = useBox(() => ({
    mass: mass,
    args: bound,
    position: [v.x,v.y,v.z],
  }), true);

  
  return (
      <mesh ref={cube} material={props.material} geometry={props.geometry} onClick={()=> console.log(props.name)} />
  )
}

const GroupMesh = ({position,children,mass,...props}) => {

  const v = position;
  
const [cube] = useBox(() => ({
  mass: mass,
  args: [1,1,1], //trouver le moyen de regler le bound
  position: [v.x,v.y,v.z],
}), true);

  return (
    <group ref={cube} >
{          Object.entries(children).map(
      ([name, obj]) => {
        return (
          <mesh key={name} material={obj.material} geometry={obj.geometry} />
      )
    }
  )}
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
  <Canvas shadowMap gl={{ alpha: false }} >
  <CameraTarget />
  
    <color attach="background" args={['lightblue']} />
    <hemisphereLight intensity={0.35} />
    <fogExp2 attach="fog" args={['black', 0.03]} />
    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
    <Sky distance={3000} turbidity={2} rayleigh={4} mieCoefficient={0.038} mieDirectionalG={0.85} sunPosition={[Math.PI, -10, 0]} exposure = {5} azimuth={0.5} />
    
    <Physics>
    <Passive url={'/passive.gltf'}  />
      <Plane />
      <Vehicle position={[-5, 5, 5]} rotation={[0, -Math.PI*1.2 , 0]} angularVelocity={[0, 0.5, 0]} />
      <Cube />
      <Cube position={[0, 10, -2]} />
      <Cube position={[0, 20, -2]} />
    </Physics>
    
  </Canvas>
  <Loader />
  </>,
  document.getElementById('root')
)
