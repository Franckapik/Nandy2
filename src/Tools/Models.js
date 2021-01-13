import { useBox } from '@react-three/cannon'
import { useGLTF } from '@react-three/drei'
import React from 'react'
import useBounds from '../hooks/useBounds'
import { useRandomFromNavmesh } from '../hooks/useRandomFromNavmesh'
import useStore from '../store'
import { Flower } from './Flower'
import { InstanciateMesh } from './InstanciateMesh'
import { Model } from './Model'

const Trash = ({ url, ...props }) => {
  const name = 'Poubelle'
  const { nodes } = useGLTF('/onclick1.gltf', '/draco/')
  const position = []
  nodes['Poubelle'].getWorldPosition().toArray(position)

  const bound = useBounds(nodes['Poubelle'])

  const [poubelleRef] = useBox(() => ({ 
    mass: 0,
    position : position,
    rotation : [Math.PI/4,0,0],
    args: bound
  }));
 

  return <mesh ref={poubelleRef} material={nodes[name].material} geometry={nodes[name].geometry} {...props}  />
}

export const Models = (props) => {
  const [randomPositions, navPosition] = useRandomFromNavmesh('/navmesh.glb', 'NavMesh', 30)
  const toggleVisible = useStore((state) => state.toggleVisible)
  return (
    <>
      <Model url={'/passive1.gltf'} mass={0} />
      <Model url={'/active1.gltf'} mass={10} />
      <Model url={'/traversant1.gltf'} mass={0} collision={0} />
      <InstanciateMesh position={navPosition} arrayOfPositions={[randomPositions]} meshUrl={'./traversant.glb'} nameMesh={'Herb'} maxNumber={1000} />
      <Flower url={'/onclick1.gltf'} name="Calendula" scale={30} Text={['Pont solitaire', <br />, 'il s’est trouvé un ami', <br />, 'le vent vagabond']} />
      <Trash />

{/*       <Single url={'/navmesh.glb'} name="NavMesh" position={navPosition} /> */}
    </>
  )
}
