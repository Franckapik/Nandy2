import React from 'react'
import { Model } from './Model'
import { useRandomFromNavmesh } from '../hooks/useRandomFromNavmesh'
import { InstanciateMesh } from './InstanciateMesh'
import { useGLTF } from '@react-three/drei'
import { Bubble } from './Bubble'
import { Cube } from '../references/Cube'
import useStore from '../store'

const Single = ({ url, name, ...props }) => {
  const { nodes } = useGLTF(url, '/draco/')
  const position = []
  nodes[name].getWorldPosition().toArray(position)
  return <mesh material={nodes[name].material} geometry={nodes[name].geometry} position={position} {...props} />
}

export const Models = (props) => {
  const [randomPositions, navPosition] = useRandomFromNavmesh('/navmesh.glb', 'NavMesh', 1000, 3)
  const toggleVisible = useStore((state) => state.toggleVisible)
  console.log(navPosition);
  return (
    <>
      <Model url={'/passive1.gltf'} mass={0} />
      <Model url={'/active1.gltf'} mass={10} />
      <Model url={'/traversant1.gltf'} mass={0} collision={0} />
      <InstanciateMesh position={navPosition} arrayOfPositions={randomPositions} meshUrl={'./traversant.glb'} nameMesh={'Herb'} maxNumber={1000} />
      <Bubble position={[-65, 2, 50]} scale={30} Text={['Pont solitaire', <br />, 'il s’est trouvé un ami', <br />, 'le vent vagabond']}>
        <Single url={'/onclick1.gltf'} name="Fleur" onClick={() => toggleVisible()} position={[8, 0, 3]} />
      </Bubble>
    </>
  )
}
