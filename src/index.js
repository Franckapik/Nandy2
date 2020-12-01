import { Physics, useBox, usePlane } from '@react-three/cannon'
import { Loader, Sky, useGLTF, useMatcapTexture } from '@react-three/drei'
import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import FPSStats from 'react-fps-stats'
import { Canvas, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import { Vector3 } from 'three'
import { ObjMesh } from './ObjMesh'
import useStore from './store'
import './styles.css'
import CameraTarget from './Tools/CameraTarget'
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
  const m1 = new THREE.MeshMatcapMaterial({ matcap: matcap })
  const pos1 = useEmpty('originMsg')

  return (
    <group>
      <mesh material={m1} geometry={nodes.Pilar.geometry} position={pos1} />
      <mesh material={materials.Mat} geometry={nodes.PIlar2.geometry} position={[-8, 0, 0]} />
      <mesh material={materials.Mat} geometry={nodes.Pilar1.geometry} position={[8, 0, 0]} />
    </group>
  )
}

export function Passive({ url }) {
  const { nodes, materials } = useGLTF(url)
  console.log('Reading glb file : ', url)
  const first = Object.keys(nodes)
  return Object.entries(nodes).map(([name, obj]) => {
    if (obj.type === 'Group' && obj.name !== first[0]) {
      return (
        <group>
          {Object.entries(obj.children).map(([name, obj]) => {
            return <ObjMesh mass={0} display={true} key={name} {...obj} position={obj.getWorldPosition()} />
          })}
        </group>
      )
    } else if (obj.type === 'Mesh') {
      //Mesh seul
      if (obj.parent.name === first[0]) {
        obj.geometry.computeBoundingBox()
        const b = obj.geometry.boundingBox.max
        let bound = [b.x * 2, b.y * 2, b.z * 2] //half extent ? And for mesh rotated?
        return <ObjMesh mass={0} display={true} key={name} {...obj} position={obj.getWorldPosition()} />
      }
    } else {
      //do nothing
    }
    return null //a verifier si erreur
  })
}

const FlowerGen = (props) => {
  function setFlowerPos(min, max) {
    let plusOrMinus = Math.random() < 0.5 ? -1 : 1
    let distance = (Math.random() * (max - min) + min).toFixed(2) * plusOrMinus
    return distance
  }

  const [count, setCount] = useState([0, 0, 0])
  const [randomTime, setTime] = useState(5)

  const min = 5
  const max = 20

  let elapsed = 0
  useFrame(({ clock }, delta) => {
    if (elapsed >= randomTime) {
      setTime(Math.random() * (max - min) + min)
      let randomPos = [setFlowerPos(2, 5), 0, setFlowerPos(2, 5)]
      const chassisPos = useStore.getState().cameraTarget //get Store once
      let offset = new Vector3(...randomPos)
      let flowerPos = new Vector3()
      let chassisV = new Vector3(...chassisPos)
      flowerPos.copy(chassisV).add(offset)
      setCount((oldArr) => [...oldArr, [flowerPos.x, flowerPos.y, flowerPos.z]])
      elapsed = 0
    } else {
      elapsed += delta
    }
  })

  return count.map((a, i) => {
    return <Cube key={i} position={a} />
  })
}

function useEmpty(name) {
  const { nodes, materials } = useGLTF('/empty.glb')
  return [nodes[name].position.x, nodes[name].position.y, nodes[name].position.z]
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
    <Canvas shadowMap gl={{ alpha: false }}>
      <CameraTarget />

      <color attach="background" args={['lightblue']} />
      <hemisphereLight intensity={0.35} />
      <fogExp2 attach="fog" args={['black', 0.03]} />
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

      <Physics>
        <Passive url={'/passive.gltf'} />
        <Plane />
        <Vehicle position={[-5, 5, 5]} rotation={[0, -Math.PI * 1.2, 0]} angularVelocity={[0, 0.5, 0]} />
        <Cube />
        <Cube position={[0, 10, -2]} />
        <Cube position={[0, 20, -2]} />
        <FlowerGen />
      </Physics>
    </Canvas>
    <Loader />
  </>,
  document.getElementById('root')
)
