import { PositionalAudio } from '@react-three/drei'
import React from 'react'
import { useRandomFromNavmesh } from '../hooks/useRandomFromNavmesh'
import { InstanciateMesh } from './InstanciateMesh'
import { Model } from './Model'

export const Models = (props) => {
  const [randomPositions, navPosition] = useRandomFromNavmesh('/navmesh.glb', 'NavMesh', 50) //warning : no draco!
/*   const [isVisible, setVisible] = useToggle(true)
 */  return (
    <>
      <Model url={'/passive1.gltf'} mass={0} />
      <Model url={'/passive2.gltf'} mass={0} />
      <Model url={'/passive3.gltf'} mass={0} />
      <Model url={'/active1.gltf'} mass={10} />
      <Model url={'/active2.gltf'} mass={10} />
      <Model url={'/traversant1.gltf'} mass={0} collision={0} />
      <Model url={'/traversant2.gltf'} mass={0} collision={0} />
      <Model url={'/woodwall.gltf'} mass={0} updateMass={1} />
      <InstanciateMesh position={navPosition} arrayOfPositions={[randomPositions]} meshUrl={'./traversant.glb'} nameMesh={'Herb'} maxNumber={1000} />
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
    <PositionalAudio url={'/lisbon.mp3'} distance={10} loop={true}   />
    </>
  )
}
