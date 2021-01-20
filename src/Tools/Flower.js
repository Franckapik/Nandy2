import { useBox } from '@react-three/cannon'
import { HTML, useGLTF } from '@react-three/drei'
import React from 'react'
import useBounds from '../hooks/useBounds'
import useToggle from '../hooks/useToggle'
import useStore from '../store'

export const Flower = ({ setVisible, Text, scale, url, name }) => {
  const { nodes } = useGLTF(url, '/draco/')
  const [bulleOpen, setBulle] = useToggle()
  const addFlower = useStore(state => state.addFlower)
  const position = []
  console.log(nodes);
  const bound = useBounds(nodes[name])
  const position2 = [-55, 2, 55]

  nodes[name].getWorldPosition().toArray(position)

  const [ref] = useBox(() => ({
    mass: 0,
    args: bound,
    position : position2,
    onCollide: () => {setVisible(false); addFlower()},
  }))

  return (
    <group ref={ref}>
      <mesh material={nodes[name].material} geometry={nodes[name].geometry} onClick={() => setBulle()} />
      {bulleOpen && (
        <HTML position={[-5,5,0]} scaleFactor={scale} center>
          <div className="bulle">{Text}</div>
        </HTML>
      )}
    </group>
  )
}
