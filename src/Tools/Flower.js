import { useBox } from '@react-three/cannon'
import { HTML, useGLTF } from '@react-three/drei'
import React, { useState } from 'react'
import useBounds from '../hooks/useBounds'

export const Flower = ({ Text, scale, url, name }) => {
  const { nodes } = useGLTF(url, '/draco/')
  const [isVisible, setVisible] = useState(true)
  const [bulleOpen, setBulle] = useState(false)
  const position = []
  const bound = useBounds(nodes[name])

  nodes[name].getWorldPosition().toArray(position)

  const [ref] = useBox(() => ({
    mass: 0,
    position: [-55, 2, 55],
    args: bound,
    onCollide: () => setVisible(false)
  }))

  return (
    <group>
      {isVisible && <mesh ref={ref} material={nodes[name].material} geometry={nodes[name].geometry} onClick={() => setBulle(true)} />}{' '}
      {bulleOpen && (
        <HTML scaleFactor={scale} center>
          <div className="bulle">{Text}</div>
        </HTML>
      )}
    </group>
  )
}
