import { PositionalAudio, useGLTF } from '@react-three/drei'
import React, { useState } from 'react'
import { useFrame } from 'react-three-fiber'
import { Vector3 } from 'three'
import useEmpty from '../hooks/useEmpty'
import { useRandom } from '../hooks/useRandom'
import useStore from '../store'
import { Frame } from './Frame'
/* import useToggle from '../hooks/useToggle'
 */ import { InstanciateMesh } from './InstanciateMesh'
import { Model } from './Model'
import Video from './Video'

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
      <FlowerGen />
      <Frame />
      <Video url={'/souffle.webm'} rotation={[0, -Math.PI, 0]} position={soufflePos} />
      <PositionalAudio url={'/lisbon.mp3'} distance={0} loop={true} />
    </>
  )
}
