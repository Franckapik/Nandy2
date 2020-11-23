import { Physics, useBox, usePlane } from '@react-three/cannon';
import { Loader, Sky, Stats, useGLTF, useMatcapTexture } from "@react-three/drei";
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import './styles.css';
import CameraTarget from './Tools/CameraTarget';
import Vehicle from './Tools/Vehicle';
import React, { Suspense, useRef } from "react";
import { Canvas, useLoader } from 'react-three-fiber'
import { GroupMesh, ObjMesh } from './Tools/MapMesh';


//const preloaded = useGLTF.preload('/pilar.glb')
//console.log(preloaded);
//or maybe useLoader.preload(GLTFLoader, url)

const useMatcaps = (urlMat) => {
  const [beige, blanc, bleuC, gris, jaune, marron, noir, orange, rouge, turquoise, vert] = useLoader(THREE.TextureLoader, [`${urlMat}beige.png`,`${urlMat}blanc.png`,`${urlMat}bleu.png`,`${urlMat}gris.png`,`${urlMat}jaune.png`,`${urlMat}marron.png`,`${urlMat}noir.png`,`${urlMat}orange.png`,`${urlMat}rouge.png`,`${urlMat}turquoise.png`,`${urlMat}vert.png`])
  
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

      return matcaps
}



const Passive = ({url, mass}) => {
  const { nodes } = useGLTF(url)
  const first = Object.keys(nodes)
  const matcaps = useMatcaps('./matcaps/512/')

  return (
    Object.entries(nodes).map(
      ([name, obj]) => {
        let bound = [2,2,2];
        if(obj.type==='Group' && obj.name !== first[0]) {
          return (<GroupMesh mat={matcaps} mass={mass} key={name} position={obj.getWorldPosition()} {...obj} />)
        }

        else if(obj.type==='Mesh') { //Mesh seul
          if(obj.parent.name===first[0]) {
            const b = obj.geometry.boundingBox;
            bound = [b.max.x, b.max.y, b.max.z]
            return <ObjMesh mat={matcaps} mass={mass} display={true} key={name} bound={bound} {...obj} position={obj.getWorldPosition()}  />  
          }
        }
        else {
        }  
        return null       
    }
  )
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
  <Canvas shadowMap gl={{ alpha: false }} >
  <CameraTarget />
  
    <color attach="background" args={['lightblue']} />
    <hemisphereLight intensity={0.35} />
    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
    <Sky distance={3000} turbidity={2} rayleigh={4} mieCoefficient={0.038} mieDirectionalG={0.85} sunPosition={[Math.PI, -10, 0]} exposure = {5} azimuth={0.5} />
    
    <Suspense fallback={null}>

    </Suspense>
    <Physics>
    <Passive url={'/passive.gltf'} mass={0}  />
    <Passive url={'/active.gltf'} mass={10}  />
      <Plane />
      <Vehicle position={[-5, 5, 5]} rotation={[0, -Math.PI*1.2 , 0]} angularVelocity={[0, 0.5, 0]} />
      <Cube />
      <Cube position={[0, 10, -2]} />
      <Cube position={[0, 20, -2]} />
    </Physics>
    <Stats />
  </Canvas>
  <Loader />
  </>,
  document.getElementById('root')
)
