import { Physics, useBox, usePlane } from '@react-three/cannon';
import { Loader, Sky, Stats, useGLTF, useTexture } from "@react-three/drei";
import React, { Suspense, useRef } from "react";
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import useStore from './store';
import './styles.css';
import CameraTarget from './Tools/CameraTarget';
import Vehicle from './Tools/Vehicle';
import { Canvas, useLoader } from 'react-three-fiber'
import {ObjMesh } from './Tools/ObjMesh';
import ParallaxMapMaterial from './Tools/parallaxMap'
import ModalBox from './Tools/ModalBox'

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

  return Object.entries(nodes).map(([name, obj]) => {
    if (obj.type === 'Group' && obj.name !== first[0]) {
      return (
        <group>
          {Object.entries(obj.children).map(([name, obj]) => {
            return <ObjMesh mat={matcaps} mass={mass} display={true} key={name} {...obj} position={obj.getWorldPosition()} />
          })}
        </group>
      )
    } else if (obj.type === 'Mesh') {
      //Mesh seul
      if (obj.parent.name === first[0]) {
        obj.geometry.computeBoundingBox()
        const b = obj.geometry.boundingBox.max
        let bound = [b.x * 2, b.y * 2, b.z * 2] //half extent ? And for mesh rotated?
        return <ObjMesh mat={matcaps} mass={mass} display={true} key={name} {...obj} position={obj.getWorldPosition()} />
      }
    } else {
      //do nothing
    }
    return null //a verifier si erreur
  })
}


function useEmpty(name) {
  const { nodes, materials } = useGLTF('/empty.glb')
  return [nodes[name].position.x,nodes[name].position.y,nodes[name].position.z];
}


function Plane({minLayers, maxLayers, parallaxFactor, mode, scale}) {

  const [map, bumpMap] = useTexture(['/textures/floor3.png', '/textures/floorbump.jpg'])

  map.wrapS = THREE.RepeatWrapping;
map.wrapT = THREE.RepeatWrapping;
map.offset.set(0, 0);
map.repeat.set( 1500,1500);

console.log(map);
  const changeVehiclePos = useStore(state => state.changeVehiclePos)
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }))

  return (
    <mesh ref={ref} receiveShadow 

    ref={ref} receiveShadow>
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

const  Hud = ({name}) => {
  const changeVehiclePos = useStore(state => state.changeVehiclePos)
  const pos2 = useEmpty('origin2Game') 
  const pos3 = useEmpty('origin3Cinema') 
  const pos4 = useEmpty('origin4Garden') 
  const pos5 = useEmpty('origin5Foodtruck') 
  const pos6 = useEmpty('origin6Techno') 
  const pos7 = useEmpty('origin7Inconnu') 
  const pos8 = useEmpty('origin8Idea') 
  const pos9 = useEmpty('origin9Ecology') 


  return (
    <div className="hud"> 
<ul>
  <li     onPointerDown={ () => {
      changeVehiclePos(pos2)
    }}
    onPointerUp={ () => {
      changeVehiclePos(0)
    }} > Actualité </li>
  <li     onPointerDown={ () => {
      changeVehiclePos(pos3)
    }}
    onPointerUp={ () => {
      changeVehiclePos(0)
    }}> Journal </li>
  <li     onPointerDown={ () => {
      changeVehiclePos(pos4)
    }}
    onPointerUp={ () => {
      changeVehiclePos(0)
    }}> Galleries </li>
  <li     onPointerDown={ () => {
      changeVehiclePos(pos5)
    }}
    onPointerUp={ () => {
      changeVehiclePos(0)
    }}> Rencontre </li>
  <li     onPointerDown={ () => {
      changeVehiclePos(pos6)
    }}
    onPointerUp={ () => {
      changeVehiclePos(0)
    }}> Boite à mots </li>
  <li     onPointerDown={ () => {
      changeVehiclePos(pos7)
    }}
    onPointerUp={ () => {
      changeVehiclePos(0)
    }}> Un autre lien </li>
  <li     onPointerDown={ () => {
      changeVehiclePos(pos8)
    }}
    onPointerUp={ () => {
      changeVehiclePos(0)
    }}> Et encore un autre </li>
  <li     onPointerDown={ () => {
      changeVehiclePos(pos9)
    }}
    onPointerUp={ () => {
      changeVehiclePos(0)
    }}> et le dernier </li>

</ul>
</div>
  )

}

ReactDOM.render(
  <>
  
  <Suspense fallback="null"> 
  <Hud />
  <ModalBox title={'Bienvenue sur Nature&You'} />
  </Suspense>
  <Canvas id='canvas' shadowMap gl={{ alpha: false }} >
    
  <CameraTarget />
  
    <hemisphereLight intensity={0.35} />
    <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
    <Sky distance={3000} turbidity={2} rayleigh={4} mieCoefficient={0.038} mieDirectionalG={0.85} sunPosition={[Math.PI, -10, 0]} exposure = {5} azimuth={0.5} />
    <Suspense fallback={null}>
    </Suspense>
    <Physics>
    <Passive url={'/passive.gltf'} mass={0}  />
    <Passive url={'/active.gltf'} mass={10}  />
      <Vehicle position={[-5, 5, 5]} rotation={[0, -Math.PI*1.2 , 0]} angularVelocity={[0, 0.5, 0]} />
      <Plane mode='basic' scale={1} parallaxFactor={-0.2} minLayers={8} maxLayers={30} />
      <Cube />
      <Cube position={[0, 10, -2]} />
      <Cube position={[0, 20, -2]} />
    </Physics>
  </Canvas>

  <Loader />
  </>,
  document.getElementById('root')
)
