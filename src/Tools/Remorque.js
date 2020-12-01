import { useBox } from '@react-three/cannon'
import { useGLTF, useHelper } from '@react-three/drei'
import React, { useRef } from 'react'
import useBounds from '../hooks/useBounds'

export const Remorque = React.forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF('remorque.gltf')
  const bound = useBounds(nodes.Remorque)

  useBox(() => ({ mass: 1, position: [-58, 2, 77], args: bound, ...props }), true, ref)

  return <mesh ref={ref} geometry={nodes.Remorque.geometry} />
})

export const Remorque2 = React.forwardRef((props, ref) => {
  const boxSize = [3, 1, 3]

  useBox(() => ({ mass: 1, position: [-58, 2, 77], args: boxSize, ...props }), true, ref)

  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" args={boxSize} />
      <meshLambertMaterial attach="material" color="orange" />
    </mesh>
  )
})
