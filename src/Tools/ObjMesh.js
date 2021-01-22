import { useBox } from '@react-three/cannon'
import React from 'react'
import useBounds from '../hooks/useBounds'
import useStore from '../store'

export const ObjMesh = ({ mat, position, display, collision, mass, updateMass, ...props }) => {
  const v = position
  const bound = useBounds(props)
  const changeTarget = useStore(state => state.changeTarget)

  const setMass = (up) => {
    if (up) {
      api.mass.set(up)
    }
  }

  const [cube, api] = useBox(
    () => ({
      mass: mass,
      args: bound,
      position: [v.x, v.y, v.z],
      allowSleep : true,
      collisionFilterGroup : collision,
      onCollide : (e) => setMass(updateMass)
      
    }),
    false
  )
  
  return (
    <mesh
    material={mat}
    key={props.name} 
    ref={cube} 
    geometry={props.geometry} 
/*     onClick={(e) => {console.log(e.eventObject.name);}}
 */    {...props} />
      

  )
}
