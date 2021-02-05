import { PositionalAudio } from '@react-three/drei'
import React from 'react'
import useEmpty from '../hooks/useEmpty'
import useToggle from '../hooks/useToggle'
import { Bird } from './Bird'
import { Flower } from './Flower'
import { FlowerGen } from './FlowerGen'
import { Frame } from './Frame'
import { MeshOnNavMesh } from './MeshOnNavMesh'
import { Model } from './Model'
import Video from './Video'

export const Models = (props) => {
  const [isVisible, setVisible] = useToggle(true)
  const soufflePos = useEmpty('origin2Souffle')
  return (
    <>
      <Model url={'/passive1.gltf'} mass={0} />
      <Model url={'/town.gltf'} mass={0} collision={0} />
      <Model url={'/passive2.gltf'} mass={0} />
      <Model url={'/passive3.gltf'} mass={0} />
      <Model url={'/active1.gltf'} mass={10} />
      <Model url={'/active2.gltf'} mass={10} />
      <Model url={'/active3.gltf'} mass={10} />
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
      <PositionalAudio url={'/lisbon.mp3'} distance={10} loop={true} />
    </>
  )
}
