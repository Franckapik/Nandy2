import { useBox } from '@react-three/cannon'
import { HTML, useGLTF } from '@react-three/drei'
import React, { useEffect, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import useBounds from '../hooks/useBounds'
import useToggle from '../hooks/useToggle'

export const Flower = ({ setVisible, Text, scale, url, name }) => {
  const { nodes } = useGLTF(url, '/draco/')
  const [bulleOpen, setBulle] = useToggle()
  const position = []
  console.log(nodes);
  const bound = useBounds(nodes[name])
  const position2 = [-55, 2, 55]

  nodes[name].getWorldPosition().toArray(position)

  const [ref, api] = useBox(() => ({
    mass: 0,
    args: bound,
    position : position2,
    onCollide: () => setVisible(false),
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
