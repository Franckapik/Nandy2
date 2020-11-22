import ReactDOM from 'react-dom'
import React, { Suspense, useRef } from "react";
import {Loader, Sky, useGLTF, useMatcapTexture } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import FPSStats from "react-fps-stats";
import { Physics, usePlane, useBox } from '@react-three/cannon'
import CameraTarget from './Tools/CameraTarget'
import './styles.css'
import * as THREE from 'three'


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
    42, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
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
  const { nodes } = useGLTF(url)
  const first = Object.keys(nodes)
  const urlMat = './matcaps/512/'
  const [beige, blanc, bleuC, gris, jaune, marron, noir, orange, rouge, turquoise, vert] = useLoader(THREE.TextureLoader, [`${urlMat}beige.png`,`${urlMat}blanc.png`,`${urlMat}bleu.png`,`${urlMat}gris.png`,`${urlMat}jaune.png`,`${urlMat}marron.png`,`${urlMat}noir.png`,`${urlMat}orange.png`,`${urlMat}rouge.png`,`${urlMat}turquoise.png`,`${urlMat}vert.png`])

  console.log(beige);
/*
  const [marron] = useMatcapTexture('6D3B1C_895638_502A0D_844C31')
  const [beige] = useMatcapTexture('796D6B_DED3CB_C6BAB1_ADA09B')
  const [blanc] = useMatcapTexture('686464_CCCAC7_A4A19F_BCB4B4')
  const [bleuF] = useMatcapTexture('2A4BA7_1B2D44_1F3768_233C81')
  const [bleuC] = useMatcapTexture('425F84_1C2939_2A3F57_24344C')
  const [gris] = useMatcapTexture('4F4F4F_9C9C9C_121212_7C7C7C')
  const [jaune] = useMatcapTexture('855D08_DAC31B_BF9B0C_AF860C')
  const [orange] = useMatcapTexture('C35C04_F9C30C_EE9F04_E08304')
  const [vert] = useMatcapTexture('9CC338_4E671A_799F27_8CAC2C')
  const [rouge] = useMatcapTexture('872F2D_AB403E_682421_581F1C')
  const [turquoise] = useMatcapTexture('2EAC9E_61EBE3_4DDDD1_43D1C6')*/

  /*const matcaps = {
    "marron" : marron, 
    "beige" : beige,
    "blanc" : blanc,
    "bleuF" : bleuF,
    "bleuC" : bleuC,
    "gris" : gris,
    "jaune" : jaune,
    "orange" : orange,
    "vert" : vert,
    "rouge" : rouge ,
    "turquoise" : turquoise,
    }*/

    const matcaps = {
      "marron" :marron, 
      "beige" :beige,
      "blanc" :blanc,
      "bleuF" :noir,
      "bleuC" :bleuC,
      "gris" :gris,
      "jaune" :jaune,
      "orange" :orange,
      "vert" :vert,
      "rouge" :rouge ,
      "turquoise" :turquoise,
      }


  return (
    Object.entries(nodes).map(
      ([name, obj]) => {
        let bound = [2,2,2];
        if(obj.type==='Group' && obj.name !== first[0]) {
          return (<GroupMesh mat={matcaps} mass={0} key={name} position={obj.getWorldPosition()} {...obj} />)
        }

        else if(obj.type==='Mesh') { //Mesh seul
          if(obj.parent.name===first[0]) {
            const b = obj.geometry.boundingBox;
            bound = [b.max.x, b.max.y, b.max.z]
            return <ObjMesh mat={matcaps} mass={0} display={true} key={name} bound={bound} {...obj} position={obj.getWorldPosition()}  />  
          }
        }
        else {
        }  
        return null       
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
  }));

console.log(props.mat);
  
  return (
    <mesh key={props.name} ref={cube} geometry={props.geometry} onClick={()=> console.log(props.name)} >
    <meshMatcapMaterial
  attach="material"
  matcap={props.mat[props.material.name]}
  />
</mesh>
  )
}

const GroupMesh = ({position,children,mass,...props}) => {

  const v = position;
  
const [cube] = useBox(() => ({
  mass: mass,
  args: [1,1,1], //trouver le moyen de regler le bound
  position: [v.x,v.y,v.z],
}));

  return (
    <group ref={cube} >
{          Object.entries(children).map(
      ([name, obj]) => {
        return (
          <mesh key={name} geometry={obj.geometry} >
              <meshMatcapMaterial
            attach="material"
            matcap={props.mat[obj.material.name]}
        />
         </mesh>
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
    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
    <Sky distance={3000} turbidity={2} rayleigh={4} mieCoefficient={0.038} mieDirectionalG={0.85} sunPosition={[Math.PI, -10, 0]} exposure = {5} azimuth={0.5} />
    
    <Suspense fallback={null}>
      {/*<Asset url="/passive.glb" />*/}
      {/*<AssettoMesh url="/pilar.glb" />*/}
    </Suspense>
    <Physics>
    <Passive url={'/passive.gltf'}  />
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
