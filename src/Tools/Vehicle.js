import { useBox, useCylinder, useRaycastVehicle } from '@react-three/cannon'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import useKeyPress from '../hooks/useKeyPress'

// The vehicle chassis
const Chassis = forwardRef((props, ref) => {
  const boxSize = [1.2, 1, 4]
  // eslint-disable-next-line
  const [_, api] = useBox(
    () => ({
      // type: 'Kinematic',
      mass: 500,
      rotation: props.rotation,
      angularVelocity: props.angularVelocity,
      allowSleep: false,
      args: boxSize,
      ...props,
    }),
    ref
  )
  return (
    <mesh ref={ref} api={api} castShadow>
      <boxBufferGeometry attach="geometry" args={boxSize} />
      <meshNormalMaterial attach="material" />
      {/*<axesHelper scale={[5, 5, 5]} />*/}
    </mesh>
  )
})

// A Wheel
const Wheel = forwardRef((props, ref) => {
  const wheelSize = [0.7, 0.7, 0.5, 16]
  useCylinder(
    () => ({
      mass: 1,
      type: 'Kinematic',
      material: 'wheel',
      collisionFilterGroup: 0, // turn off collisions !!
      args: wheelSize,
      ...props,
    }),
    ref
  )
  // useCompoundBody(
  //   () => ({
  //     mass: 1,
  //     type: 'Kinematic',
  //     material: 'wheel',
  //     collisionFilterGroup: 0, // turn off collisions
  //     ...props,
  //     shapes: [{ type: 'Cylinder', args: wheelSize, rotation: [Math.PI / 2, 0, 0] }],
  //   }),
  //   ref
  // )
  return (
    <mesh ref={ref}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderBufferGeometry attach="geometry" args={wheelSize} />
        <meshNormalMaterial attach="material" />
      </mesh>
    </mesh>
  )
})

const wheelInfo = {
  radius: 0.7,
  directionLocal: [0, -1, 0], // same as Physics gravity
  suspensionStiffness: 30,
  suspensionRestLength: 0.3,
  maxSuspensionForce: 1e4,
  maxSuspensionTravel: 0.3,
  dampingRelaxation: 2.3,
  dampingCompression: 4.4,
  frictionSlip: 5,
  rollInfluence: 0.01,
  axleLocal: [1, 0, 0], // wheel rotates around X-axis
  chassisConnectionPointLocal: [1, 0, 1],
  isFrontWheel: false,
  useCustomSlidingRotationalSpeed: true,
  customSlidingRotationalSpeed: -30,
}

function Vehicle(props) {
  // chassisBody
  const chassis = useRef()
  // wheels
  const wheels = []
  const wheelInfos = []

  // chassis - wheel connection helpers
  var chassisWidth = 2
  var chassisHeight = 0
  var chassisFront = 1
  var chassisBack = -1

  // FrontLeft [-X,Y,Z]
  const wheel_1 = useRef()
  wheels.push(wheel_1)
  const wheelInfo_1 = { ...wheelInfo }
  wheelInfo_1.chassisConnectionPointLocal = [-chassisWidth / 2, chassisHeight, chassisFront]
  wheelInfo_1.isFrontWheel = true
  wheelInfos.push(wheelInfo_1)
  // FrontRight [X,Y,Z]
  const wheel_2 = useRef()
  wheels.push(wheel_2)
  const wheelInfo_2 = { ...wheelInfo }
  wheelInfo_2.chassisConnectionPointLocal = [chassisWidth / 2, chassisHeight, chassisFront]
  wheelInfo_2.isFrontWheel = true
  wheelInfos.push(wheelInfo_2)
  // BackLeft [-X,Y,-Z]
  const wheel_3 = useRef()
  wheels.push(wheel_3)
  const wheelInfo_3 = { ...wheelInfo }
  wheelInfo_3.chassisConnectionPointLocal = [-chassisWidth / 2, chassisHeight, chassisBack]
  wheelInfo_3.isFrontWheel = false
  wheelInfos.push(wheelInfo_3)
  // BackRight [X,Y,-Z]
  const wheel_4 = useRef()
  wheels.push(wheel_4)
  const wheelInfo_4 = { ...wheelInfo }
  wheelInfo_4.chassisConnectionPointLocal = [chassisWidth / 2, chassisHeight, chassisBack]
  wheelInfo_4.isFrontWheel = false
  wheelInfos.push(wheelInfo_4)

  const [vehicle, api] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels: wheels,
    wheelInfos: wheelInfos,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }))

  const forward = useKeyPress('z')
  // const forward = useKeyPress('z')
  const backward = useKeyPress('s')
  const left = useKeyPress('q')
  // const left = useKeyPress('q')
  const right = useKeyPress('d')
  const brake = useKeyPress(' ') // space bar
  const reset = useKeyPress('r')

  const [steeringValue, setSteeringValue] = useState(0)
  const [engineForce, setEngineForce] = useState(0)
  const [brakeForce, setBrakeForce] = useState(0)

  var maxSteerVal = 0.5
  var maxForce = 1e3
  var maxBrakeForce = 1e5

  useFrame(() => {
    if (left && !right) {
      setSteeringValue(maxSteerVal)
    } else if (right && !left) {
      setSteeringValue(-maxSteerVal)
    } else {
      setSteeringValue(0)
    }
    if (forward && !backward) {
      setBrakeForce(0)
      setEngineForce(-maxForce)
    } else if (backward && !forward) {
      setBrakeForce(0)
      setEngineForce(maxForce)
    } else if (engineForce !== 0) {
      setEngineForce(0)
    }
    if (brake) {
      setBrakeForce(maxBrakeForce)
    }
    if (reset) {
      chassis.current.api.position.set(0, 5, 0)
      chassis.current.api.velocity.set(0, 0, 0)
      chassis.current.api.angularVelocity.set(0, 0.5, 0)
      chassis.current.api.rotation.set(0, -Math.PI / 4, 0)
    }
  })

  useEffect(() => {
    api.applyEngineForce(engineForce, 2)
    api.applyEngineForce(engineForce, 3)
  }, [engineForce])
  useEffect(() => {
    api.setSteeringValue(steeringValue, 0)
    api.setSteeringValue(steeringValue, 1)
  }, [steeringValue])
  useEffect(() => {
    api.setBrake(brakeForce, 0)
    api.setBrake(brakeForce, 1)
    api.setBrake(brakeForce, 2)
    api.setBrake(brakeForce, 3)
  }, [brakeForce])

  return (
    <group ref={vehicle}>
      <Chassis
        ref={chassis}
        rotation={props.rotation}
        position={props.position}
        angularVelocity={props.angularVelocity}></Chassis>
      <Wheel ref={wheel_1}></Wheel>
      <Wheel ref={wheel_2}></Wheel>
      <Wheel ref={wheel_3}></Wheel>
      <Wheel ref={wheel_4}></Wheel>
    </group>
  )
}



export default Vehicle