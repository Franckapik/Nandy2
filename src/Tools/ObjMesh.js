import React, { useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { useBox } from '@react-three/cannon'
import useBounds from '../hooks/useBounds'
const Helper = React.forwardRef(({ bound, visible }, ref) => {
  return (
    <mesh ref={ref} visible={visible}>
      <boxBufferGeometry attach="geometry" args={bound} />
      <lineBasicMaterial attach="material" color="orange" />
    </mesh>
  )
})

export const ObjMesh = ({ position, display, mass, ...props }) => {
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

  const helperRef = useRef()

  useFrame(() => {
    helperRef.current.position.copy(cube.current.position)
    helperRef.current.rotation.copy(cube.current.rotation)
  })

  return (
    <>
    <mesh key={props.name} ref={cube} geometry={props.geometry} onClick={() => console.log(props.name)}>
    <meshStandardMaterial color={'orange'} />
    </mesh>
      <Helper ref={helperRef} visible={false} bound={bound} />
    </>
  )
}
