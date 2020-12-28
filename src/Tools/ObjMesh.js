import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { useBox } from '@react-three/cannon'
import useBounds from '../hooks/useBounds'

export const ObjMesh = ({ mat, position, display, mass, ...props }) => {
  const v = position
  const bound = useBounds(props)

  const [cube] = useBox(
    () => ({
      mass: mass,
      args: bound,
      position: [v.x, v.y, v.z]
    }),
    false
  )

  return (
    <mesh
    material={mat}
    key={props.name} 
    ref={cube} 
    geometry={props.geometry} 
    onClick={() => console.log(props.name)}>
    </mesh>
  )
}
