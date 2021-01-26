import { useBox } from '@react-three/cannon'
import { HTML, useGLTF } from '@react-three/drei'
import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { Vector3 } from 'yuka'
import useBounds from '../hooks/useBounds'
import useToggle from '../hooks/useToggle'
import useStore from '../store'

export const Flower = ({ setVisible, Text, scale, url, name }) => {
  const { nodes } = useGLTF(url, '/draco/')
  const [bulleOpen, setBulle] = useToggle()
  const addFlower = useStore(state => state.addFlower)
  const bound = useBounds(nodes[name])
  const position2 = [-55, 2, 55]

  const [ref] = useBox(() => ({
    mass: 0,
    args: bound,
    position : position2,
    onCollide: () => {setVisible(false); addFlower()},
  }))

  const flowerRef = useRef()

  useFrame((state, delta) => {
    flowerRef.current.rotation.set(0, state.clock.getElapsedTime()* 2, 0)
  })

  return (
    <group ref={ref}>
      <mesh ref={flowerRef} material={nodes[name].material} geometry={nodes[name].geometry} onClick={() => setBulle()} />
      {bulleOpen && (
        <HTML position={[-5,5,0]} scaleFactor={scale} center>
          <div className="bulle">{Text}</div>
        </HTML>
      )}
    </group>
  )
}
