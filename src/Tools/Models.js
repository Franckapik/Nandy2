import { PositionalAudio, useGLTF } from '@react-three/drei'
import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import { AnimationMixer, Vector3 } from 'three'
import useEmpty from '../hooks/useEmpty'
import { useRandom } from '../hooks/useRandom'
import Budie from '../references/Budie'
import useStore from '../store'
import { Frame } from './Frame'
/* import useToggle from '../hooks/useToggle'
 */ import { InstanciateMesh } from './InstanciateMesh'
import { Model } from './Model'
import Video from './Video'

const Bird = (props) => {
  const { nodes, materials, animations } = useGLTF('./animation1.gltf')
  const actions = useRef()
  const ref = useRef()
  const [mixer] = useState(() => new AnimationMixer())
  const name = 'Oiseau'
  useFrame((state, delta) => {
    
    ref.current.position.z += 0.1
    mixer.update(delta)})
  useEffect(() => {
    console.log(nodes);
     actions.current = {
      Marche: mixer.clipAction(animations[0], ref.current).play()
    } 
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])

  return (    
  <group ref={ref} position={[-50,12,10]} rotation={[Math.PI/1.5,0,0]} {...props} dispose={null}>
    {
    Object.entries(nodes).map((obj, name) => {
      console.log(obj);
      if (obj[1].type === 'Bone' ) {
        console.log(obj[1].name);
        return <primitive object={obj[1]} />
      }
      if (obj[1].type === 'SkinnedMesh') {
        console.log(obj[1]);
        return     <skinnedMesh
        onClick={() => {
          console.log('Marche!')
        }}
        material={obj[1].material}
        geometry={obj[1].geometry}
        skeleton={obj[1].skeleton}
      />
      }
    }
    )
  }

  </group>)
}

const FlowerGen = (props) => {
  const [count, setCount] = useState([])
  const [randomTime, setTime] = useState(5)
  const { nodes } = useGLTF('./traversant1.gltf', '/draco/'); // no .glb
  const name = 'Herb1'

  function setFlowerPos(min, max) {
    let plusOrMinus = Math.random() < 0.5 ? -1 : 1
    let distance = (Math.random() * (max - min) + min).toFixed(2) * plusOrMinus
    return distance
  }
  const min = 1
  const max = 3
  const offset = new Vector3()
  const flowerPos = new Vector3()

  let elapsed = 0
  useFrame(( _, delta) => {
    const vehicle = useStore.getState().vehicleObj
    if (vehicle) {
      if (elapsed >= randomTime) {
        const pos = []
        setTime(Math.random() * (max - min) + min);
        offset.set(setFlowerPos(2, 5), 0, setFlowerPos(2, 5))
        vehicle.position.setY(0);
        flowerPos.copy(vehicle.position).add(offset).toArray(pos)
        setCount((oldArr) => [...oldArr, pos])
       elapsed = 0
      } else {
        elapsed += delta
      }
    }
  })

   return count.map(
     (a, i) => <mesh material={nodes[name].material} geometry={nodes[name].geometry} position={a} />
   ) 

}

const MeshOnNavMesh = ({navMeshUrl, nameNavMesh, meshUrl, nameMesh, maxNumber}) => {

  const [random, navPos] = useRandom(navMeshUrl, nameNavMesh, maxNumber)
  return(
    <InstanciateMesh position={navPos} arrayOfPositions={random} meshUrl={meshUrl} nameMesh={nameMesh} maxNumber={maxNumber} />
  )
}
export const Models = (props) => {
  /*   const [isVisible, setVisible] = useToggle(true)
   */ const soufflePos = useEmpty('origin2Souffle')
  return (
    <>
      <Model url={'/passive1.gltf'} mass={0} />
      <Model url={'/passive2.gltf'} mass={0} />
      <Model url={'/passive3.gltf'} mass={0} />
      <Model url={'/active1.gltf'} mass={10} />
      <Model url={'/active2.gltf'} mass={10} />
      <Model url={'/traversant1.gltf'} mass={0} collision={0} />
      <Model url={'/traversant2.gltf'} mass={0} collision={0} />
      <Model url={'/woodwall.gltf'} mass={0} updateMass={1} />
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'Herb'} maxNumber={40} />
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'detritus01'} maxNumber={5} />
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'detritus02'} maxNumber={10} />
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'detritus03'} maxNumber={12} />
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'detritus06'} maxNumber={8} />
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'detritus08'} maxNumber={5} />
      {/*       {isVisible && (
        <Flower
          url={'/onclick1.gltf'}
          setVisible={setVisible}
          name="Calendula"
          scale={30}
          Text={['Pont solitaire', <br />, 'il s’est trouvé un ami', <br />, 'le vent vagabond']}
        />
      )}
      <Trash /> */}
      <Bird />
      <FlowerGen />
      <Frame />
      <Video url={'/souffle.webm'} rotation={[0, -Math.PI, 0]} position={soufflePos} />
      <PositionalAudio url={'/lisbon.mp3'} distance={0} loop={true} />
    </>
  )
}
