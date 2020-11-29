import React, { useRef } from 'react'
import { Physics, usePlane, useBox, useConeTwistConstraint } from '@react-three/cannon'


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

//existing constraints (https://knowledge.autodesk.com/support/maya/learn-explore/caas/CloudHelp/cloudhelp/2016/ENU/Maya/files/GUID-CDB3638D-23AF-49EF-8EF6-53081EE4D39D-htm.html)

//usePointToPointConstraint (?)
//useConeTwistConstraint (point to point avec des limites : bras /lampe )
//useDistanceConstraint (distance)
//useHingeConstraint (charnière)
//useLockConstraint 
//useSpring (ressort))



const BoxAndBall = () => {
    const box = useRef()
    const ball = useRef()
    const chainSize = [0.15, 1, 0.15]

    useConeTwistConstraint(box, ball, {
        pivotA: [0, -chainSize[1] / 2, 0],
        pivotB: [0, chainSize[1] / 2, 0],
        axisA: [0, 1, 0],
        axisB: [0, 1, 0],
        twistAngle: 0,
        angle: Math.PI / 8,
      })

    return (
      <>
        <Remorque ref={box}  />
        <Remorque2 ref={ball} />
      </>
    )
  }

export default BoxAndBall
export {Remorque, Remorque2}