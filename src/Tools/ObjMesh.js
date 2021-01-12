import { useBox } from '@react-three/cannon'
import React from 'react'
import useBounds from '../hooks/useBounds'
import useStore from '../store'

export const ObjMesh = ({ mat, position, display, collision, mass, ...props }) => {
  const v = position
  const bound = useBounds(props)
  const changeTarget = useStore(state => state.changeTarget)


  const [cube] = useBox(
    () => ({
      mass: mass,
      args: bound,
      position: [v.x, v.y, v.z],
      allowSleep : true,
      collisionFilterGroup : collision
    }),
    false
  )

  return (
    <mesh
    material={mat}
    key={props.name} 
    ref={cube} 
    geometry={props.geometry} 
    onClick={(e) => {changeTarget(e.eventObject); console.log(e.eventObject.name);}}
    {...props} />
      

  )
}
