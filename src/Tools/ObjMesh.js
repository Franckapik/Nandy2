import { useBox } from '@react-three/cannon'
import React from 'react'
import useBounds from '../hooks/useBounds'

export const ObjMesh = ({ mat, position, display, mass, ...props }) => {
  const v = position
  const bound = useBounds(props)

  const [cube] = useBox(
    () => ({
      mass: mass,
      args: bound,
      position: [v.x, v.y, v.z],
      allowSleep : true
    }),
    false
  )

  return (
    <mesh
    material={mat}
    key={props.name} 
    ref={cube} 
    geometry={props.geometry} 
    onClick={() => console.log(props.name)}
    castShadow>
      
    </mesh>
  )
}
