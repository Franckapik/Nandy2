import React, { useRef } from 'react'
import { Physics, usePlane, useBox } from '@react-three/cannon'


const Remorque = React.forwardRef((props, ref) => {
  useBox(() => ({ mass: 1, position: [-58,2,77], rotation: [0.4, 0.2, 0.5], ...props }),true, ref)
  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="yellow" />
    </mesh>
  )
})

const Remorque2 = React.forwardRef((props, ref) => {
  useBox(() => ({ mass: 1, position: [-58,2,77], rotation: [0.4, 0.2, 0.5], ...props }),true, ref)
  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" color="yellow" />
    </mesh>
  )
})

const BoxAndBall = () => {
    const box = useRef()
    const ball = useRef()

    return (
      <>
        <Remorque ref={box}  />
        <Remorque2 ref={ball} />
      </>
    )
  }

export default BoxAndBall
export {Remorque, Remorque2}