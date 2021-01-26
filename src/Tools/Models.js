import { PositionalAudio, useGLTF } from '@react-three/drei'
import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import { AnimationMixer } from 'three'
import useEmpty from '../hooks/useEmpty'
import { useRandom } from '../hooks/useRandom'
import Budie from '../references/Budie'
import { Frame } from './Frame'
import useToggle from '../hooks/useToggle'
import { InstanciateMesh } from './InstanciateMesh'
import { Model } from './Model'
import Video from './Video'
import { Flower } from './Flower'
import { FlowerGen } from './FlowerGen'
import { Cube } from '../references/Cube'

const Bird = ({ url }, props) => {
  const { nodes, materials, animations } = useGLTF(url)
  const actions = useRef()
  const ref = useRef()
  const [mixer] = useState(() => new AnimationMixer())
  useFrame((state, delta) => {
    ref.current.position.z += 0.1
    mixer.update(delta)
  })
  useEffect(() => {
    actions.current = {
      Marche: mixer.clipAction(animations[0], ref.current).play()
    }
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])

  return (
    <group ref={ref} {...props} dispose={null}>
      {Object.entries(nodes).map((obj, name) => {
        if (obj[1].type === 'Bone') {
          return <primitive object={obj[1]} />
        }
        if (obj[1].type === 'SkinnedMesh') {
          console.log(obj[1])
          return (
            <skinnedMesh
              material={obj[1].material}
              geometry={obj[1].geometry}
              skeleton={obj[1].skeleton}
            />
          )
        }
      })}
    </group>
  )
}

const MeshOnNavMesh = ({ navMeshUrl, nameNavMesh, meshUrl, nameMesh, maxNumber }) => {
  const [random, navPos] = useRandom(navMeshUrl, nameNavMesh, maxNumber)
  return <InstanciateMesh position={navPos} arrayOfPositions={random} meshUrl={meshUrl} nameMesh={nameMesh} maxNumber={maxNumber} />
}
export const Models = (props) => {
  const [isVisible, setVisible] = useToggle(true)
  const soufflePos = useEmpty('origin2Souffle')
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
      {isVisible && (
        <Flower
          url={'/onclick1.gltf'}
          setVisible={setVisible}
          name="Flower"
          scale={30}
          Text={['Pont solitaire', <br />, 'il s’est trouvé un ami', <br />, 'le vent vagabond']}
        />
      )}
      {/*  <Trash />  */}
      <Bird url={'./animation1.gltf'} position={[-50, 12, 10]} rotation={[Math.PI / 1.5, 0, 0]} />
      <FlowerGen />
      <Frame />
      <Video url={'/souffle.webm'} rotation={[0, -Math.PI, 0]} position={soufflePos} />
      <Video url={'/souffle.webm'} rotation={[0, -Math.PI, 0]} position={soufflePos} />
      <Cube position={[-50, -1, 58]} />
      <PositionalAudio url={'/lisbon.mp3'} distance={10} loop={true} />
    </>
  )
}
