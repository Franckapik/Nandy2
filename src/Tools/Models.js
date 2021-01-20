import { useBox } from '@react-three/cannon'
import { useGLTF } from '@react-three/drei'
import React, { useEffect, useState } from 'react'
import useBounds from '../hooks/useBounds'
import { useRandomFromNavmesh } from '../hooks/useRandomFromNavmesh'
import useToggle from '../hooks/useToggle'
import { Flower } from './Flower'
import { InstanciateMesh } from './InstanciateMesh'
import { Model } from './Model'

const Woodwall = ({ url, ...props }) => {
  const { nodes } = useGLTF('/onclick1.gltf', '/draco/')
  const [isCollided, setCollide] = useToggle(false)
  const name = ['Woodwallbg', 'Planche1']
  const position = []
  nodes[name[0]].getWorldPosition().toArray(position)

  const bound = useBounds(nodes[name[0]])

  const [poubelleRef, api] = useBox(() => ({
    mass: 0,
    position: position,
    args: bound,
    onCollide: () => setCollide()
  }))

  useEffect(()=> {
    if (isCollided) {
      console.log('oui');
      api.mass.set(5)
    }
  }, [isCollided])

  return (
  <group >
  <mesh  material={nodes[name[0]].material} geometry={nodes[name[0]].geometry} {...props} />
  <mesh  material={nodes[name[1]].material} geometry={nodes[name[1]].geometry} {...props} />
  </group>
  )
}

const Trash = ({ url, ...props }) => {
  const name = 'Poubelle'
  const { nodes } = useGLTF('/onclick1.gltf', '/draco/')
  const position = []
  nodes['Poubelle'].getWorldPosition().toArray(position)

  const bound = useBounds(nodes['Poubelle'])

  const [poubelleRef] = useBox(() => ({
    mass: 0,
    position: position,
    rotation: [Math.PI / 4, 0, 0],
    args: bound
  }))

  return <mesh ref={poubelleRef} material={nodes[name].material} geometry={nodes[name].geometry} {...props} />
}

export const Models = (props) => {
  const [randomPositions, navPosition] = useRandomFromNavmesh('/navmesh.glb', 'NavMesh', 50) //warning : no draco!
  const [isVisible, setVisible] = useToggle(true)
  console.log(randomPositions);
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
    </>
  )
}
