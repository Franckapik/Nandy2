import React from 'react'
import { PositionalAudio } from '@react-three/drei'
import useEmpty from '../hooks/useEmpty'
import { useRandomFromNavmesh } from '../hooks/useRandomFromNavmesh'
/* import useToggle from '../hooks/useToggle'
 */ import { InstanciateMesh } from './InstanciateMesh'
import { Model } from './Model'
import Video from './Video'
import { Frame } from './Frame'

const MeshOnNavMesh = ({navMeshUrl, nameNavMesh, meshUrl, nameMesh, maxNumber}) => {
  console.log({navMeshUrl, nameNavMesh, meshUrl, nameMesh, maxNumber});

  const [randomPositions, navPosition] = useRandomFromNavmesh(navMeshUrl, nameNavMesh, 50) //warning : no draco!
  return(
    <InstanciateMesh position={navPosition} arrayOfPositions={[randomPositions]} meshUrl={meshUrl} nameMesh={nameMesh} maxNumber={maxNumber} />
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
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'Herb'} maxNumber={1000} />
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'detritus01'} maxNumber={1000} />
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'detritus02'} maxNumber={1000} />
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'detritus03'} maxNumber={1000} />
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'detritus06'} maxNumber={1000} />
      <MeshOnNavMesh navMeshUrl={'/navmesh.glb'} nameNavMesh={'NavMesh'} meshUrl={'./instances.glb'} nameMesh={'detritus08'} maxNumber={1000} />
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
      <Frame />
      <Video url={'/souffle.webm'} rotation={[0, -Math.PI, 0]} position={soufflePos} />

      <PositionalAudio url={'/lisbon.mp3'} distance={0} loop={true} />
    </>
  )
}
