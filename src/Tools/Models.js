import React from 'react'
import { PositionalAudio } from '@react-three/drei'
import useEmpty from '../hooks/useEmpty'
import { useRandomFromNavmesh } from '../hooks/useRandomFromNavmesh'
/* import useToggle from '../hooks/useToggle'
 */import { InstanciateMesh } from './InstanciateMesh'
import { Model } from './Model'
import Video from './Video'

export const Models = (props) => {
  const [randomPositions, navPosition] = useRandomFromNavmesh('/navmesh.glb', 'NavMesh', 50) //warning : no draco!
/*   const [isVisible, setVisible] = useToggle(true)
 */  const soufflePos = useEmpty('origin2Souffle')

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
                <Video
        url={"/souffle.webm"}
        rotation={[0, -Math.PI, 0]}
        position={soufflePos}
      />

    <PositionalAudio url={'/lisbon.mp3'} distance={0} loop={true}   />
    </>
  )
}
