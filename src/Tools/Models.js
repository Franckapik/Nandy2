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
  const name = 'Woodwallbg'
  const position = []
  nodes[name].getWorldPosition().toArray(position)

  const bound = useBounds(nodes[name])

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
  <group>
  <mesh ref={poubelleRef} material={nodes[name].material} geometry={nodes[name].geometry} {...props} />
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
  const [randomPositions, navPosition] = useRandomFromNavmesh('/navmesh.glb', 'NavMesh', 30)
  const [isVisible, setVisible] = useToggle(true)

  return (
    <>
      <Model url={'/passive1.gltf'} mass={0} />
      <Model url={'/active1.gltf'} mass={10} />
      <Model url={'/traversant1.gltf'} mass={0} collision={0} />
      <InstanciateMesh position={navPosition} arrayOfPositions={[randomPositions]} meshUrl={'./traversant.glb'} nameMesh={'Herb'} maxNumber={1000} />
      {isVisible && (
        <Flower
          url={'/onclick1.gltf'}
          setVisible={setVisible}
          name="Calendula"
          scale={30}
          Text={['Pont solitaire', <br />, 'il s’est trouvé un ami', <br />, 'le vent vagabond']}
        />
      )}
      <Woodwall />
      <Trash />
    </>
  )
}
