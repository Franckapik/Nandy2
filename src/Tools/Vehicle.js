import { useBox, useCylinder, useRaycastVehicle } from '@react-three/cannon'
import { useGLTF } from '@react-three/drei'
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import { useControl } from 'react-three-gui'
import useEmpty from '../hooks/useEmpty'
import useKeyPress from '../hooks/useKeyPress'
import useStore from '../store'

const Vehicle = () => {
  const chassisRef = useRef()
  const emptyVehiclePos = useEmpty('origin1Character')
  const { nodes } = useGLTF('./character.gltf', '/draco/')

  const [steeringValue, setSteeringValue] = useState(0)
  const [engineForce, setEngineForce] = useState(0)
  const [brakeForce, setBrakeForce] = useState(0)

  let changeTarget = useStore((state) => state.changeTarget)
  let saveVehicle = useStore((state) => state.saveVehicle)
  let portal = useStore((state) => state.portal)

  const vehicle = {
    wheelInfo: {
      radius: 0.7,
      wheelMass: 1,
      wheelHelper: true,
      wheelDistanceX: 2,
      suspensionStiffness: 30, //rigidité suspensions
      suspensionRestLength: 0.1, //suspensions longueur de repos
      maxSuspensionForce: 1e4,
      maxSuspensionTravel: 0.3,
      dampingRelaxation: 2.3,
      dampingCompression: 4.4,
      frictionSlip: 5, //friction au sol
      rollInfluence: 0.01,
      chassisConnectionPointLocal: [1, 0, 1],
      isFrontWheel: false,
      useCustomSlidingRotationalSpeed: true,
      customSlidingRotationalSpeed: -30,
      axleLocal: [1, 0, 0], // wheel rotates around X-axis
      directionLocal: [0, -1, 0], // same as Physics gravity,
      visible: false //make wheel visible
    },
    chassis: {
      chassisWidth: 2,
      chassisHeight: -1,
      chassisLength: 2,
      shape: null,
      scale: 1.5,
      chassisMass: 200,
      allowSleep: false,
      chassisHelper: false
    },
    forces: {
      maxSteerVal: 0.5,
      maxForce: 1000,
      maxBrakeForce: 1e5
    },
    api: {
      chassisBody: chassisRef,
      wheels: [],
      wheelInfos: [],
      indexForwardAxis: 2,
      indexRightAxis: 0,
      indexUpAxis: 1
    }
  }

  vehicle.wheelInfo.radius = useControl('wheel Radius', { type: 'number', value: vehicle.wheelInfo.radius, min: 0, max: 5 })
  vehicle.wheelInfo.wheelMass = useControl('wheel Mass', { type: 'number', value: vehicle.wheelInfo.wheelMass, min: 0, max: 5 })
  vehicle.wheelInfo.wheelHelper = useControl('wheel Helper', { type: 'boolean', value: vehicle.wheelInfo.wheelHelper })
  vehicle.wheelInfo.wheelDistanceX = useControl('wheel Distance', { type: 'number', value: vehicle.wheelInfo.wheelDistanceX, min: 1, max: 5 })
  vehicle.wheelInfo.suspensionStiffness = useControl('suspension Stiffness', { type: 'number', value: vehicle.wheelInfo.suspensionStiffness, min: 0, max: 50 })
  vehicle.wheelInfo.suspensionRestLength = useControl('suspension RestLength', { type: 'number', value: vehicle.wheelInfo.suspensionRestLength, min: 0, max: 10 })
  vehicle.wheelInfo.maxSuspensionForce = useControl('maxSuspensionForce', { type: 'number', value: vehicle.wheelInfo.maxSuspensionForce, min: 0, max: 1e5 })
  vehicle.wheelInfo.maxSuspensionTravel = useControl('maxSuspensionTravel', { type: 'number', value: vehicle.wheelInfo.maxSuspensionTravel, min: 0, max: 2 })
  vehicle.wheelInfo.dampingRelaxation = useControl('dampingRelaxation', { type: 'number', value: vehicle.wheelInfo.dampingRelaxation, min: 0, max: 10 })
  vehicle.wheelInfo.frictionSlip = useControl('frictionSlip', { type: 'number', value: vehicle.wheelInfo.frictionSlip, min: 0, max: 10 })
  vehicle.wheelInfo.rollInfluence = useControl('rollInfluence', { type: 'number', value: 0.01, min: 0, max: 1 })
  vehicle.wheelInfo.customSlidingRotationalSpeed = useControl('customSlidingRotationalSpeed', { type: 'number', value: vehicle.wheelInfo.rollInfluence, min: -50, max: 50 })
  vehicle.chassis.chassisWidth = useControl('chassisWidth', { type: 'number', value: vehicle.chassis.chassisWidth, min: -5, max: 5 })
  vehicle.chassis.chassisHeight = useControl('chassisHeight', { type: 'number', value: vehicle.chassis.chassisHeight, min: -5, max: 5 })
  vehicle.chassis.chassisLength = useControl('chassisLength', { type: 'number', value: vehicle.chassis.chassisLength, min: -5, max: 5 })
  vehicle.chassis.chassisScale = useControl('chassisScale', { type: 'number', value: vehicle.chassis.chassisScale, min: 0, max: 5 })
  vehicle.chassis.chassisMass = useControl('chassisMass', { type: 'number', value: vehicle.chassis.chassisMass, min: 0, max: 500 })
  vehicle.chassis.chassisSleep = useControl('Chassis Sleep', { type: 'boolean', value: false })
  vehicle.chassis.chassisHelper = useControl('Chassis Helper', { type: 'boolean', value: vehicle.chassis.chassisHelper })
  vehicle.forces.maxSteerVal = useControl('maxSteerVal', { type: 'number', value: vehicle.forces.maxSteerVal, min: 0, max: 2 })
  vehicle.forces.maxForce = useControl('maxSteerVal', { type: 'number', value: vehicle.forces.maxForce, min: 0, max: 5e4 })
  vehicle.forces.maxBrakeForce = useControl('maxBrakeForce', { type: 'number', value: vehicle.forces.maxBrakeForce, min: 0, max: 1e6 })

  const pointX = [-1, 1, -1, 1]
  const pointZ = [1, 1, -1, -1]
  const frontWheel = [true, true, false, false]

  new Array(4).fill('wheel').map((a, i) => {
    const wheel_info = { ...vehicle.wheelInfo }
    wheel_info.chassisConnectionPointLocal = [
      (pointX[i] * vehicle.chassis.chassisWidth) / vehicle.wheelInfo.wheelDistanceX,
      vehicle.chassis.chassisHeight,
      pointZ[i] * vehicle.chassis.chassisLength
    ]
    wheel_info.isFrontWheel = frontWheel[i]
    vehicle.api.wheelInfos.push(wheel_info)
  })

  const [wheel_1, wheel_2, wheel_3, wheel_4] = [useRef(), useRef(), useRef(), useRef()]
  const wheels = [wheel_1, wheel_2, wheel_3, wheel_4]
  vehicle.api.wheels = wheels

  const [vehicleRef, api] = useRaycastVehicle(() => vehicle.api)

  const forward = useKeyPress('z')
  const backward = useKeyPress('s')
  const left = useKeyPress('q')
  const right = useKeyPress('d')
  const brake = useKeyPress(' ') // space bar
  const reset = useKeyPress('r')

  useFrame(() => {
    if (left && !right) {
      setSteeringValue(-vehicle.forces.maxSteerVal)
    } else if (right && !left) {
      setSteeringValue(vehicle.forces.maxSteerVal)
    } else {
      setSteeringValue(0)
    }
    if (forward && !backward) {
      setBrakeForce(0)
      setEngineForce(vehicle.forces.maxForce)
    } else if (backward && !forward) {
      setBrakeForce(0)
      setEngineForce(-vehicle.forces.maxForce)
    } else if (engineForce !== 0) {
      setEngineForce(0)
    }
    if (brake) {
      setBrakeForce(vehicle.forces.maxBrakeForce)
    }
    if (reset) {
      //chassis.current.api.position.set(0, 5, 0)
      chassisRef.current.api.velocity.set(0, 0, 0)
      chassisRef.current.api.angularVelocity.set(0, 0.5, 0)
      chassisRef.current.api.rotation.set(0, -Math.PI / 4, 0)
    }
    if (portal) {
      chassisRef.current.api.position.set(portal[0], portal[1], portal[2])
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

  useEffect(
    () =>
      chassisRef.current.api.position.subscribe(
        (
          position //https://github.com/pmndrs/zustand#transient-updates-for-often-occuring-state-changes
        ) => {
          saveVehicle(chassisRef.current)
        }
      ),
    [chassisRef]
  )

  useEffect(() => {
    return () => console.log('unmounting...')
  }, [])

  return (
    <group ref={vehicleRef}>
      <Chassis
        geo={nodes.Cloud001.geometry}
        mat={nodes.Cloud001.material}
        ref={chassisRef}
        position={emptyVehiclePos}
        scale={vehicle.chassis.scale}
        mass={vehicle.chassis.chassisMass}
        chassisHelper={vehicle.chassis.chassisHelper}
      />
      <Wheel
        ref={wheel_1}
        radius={vehicle.wheelInfo.radius}
        mass={vehicle.wheelInfo.wheelMass}
        visible={vehicle.wheelInfo.visible}
        wheelHelper={vehicle.wheelInfo.wheelHelper}
      />
      <Wheel
        ref={wheel_2}
        radius={vehicle.wheelInfo.radius}
        mass={vehicle.wheelInfo.wheelMass}
        visible={vehicle.wheelInfo.visible}
        wheelHelper={vehicle.wheelInfo.wheelHelper}
      />
      <Wheel
        ref={wheel_3}
        radius={vehicle.wheelInfo.radius}
        mass={vehicle.wheelInfo.wheelMass}
        visible={vehicle.wheelInfo.visible}
        wheelHelper={vehicle.wheelInfo.wheelHelper}
      />
      <Wheel
        ref={wheel_4}
        radius={vehicle.wheelInfo.radius}
        mass={vehicle.wheelInfo.wheelMass}
        visible={vehicle.wheelInfo.visible}
        wheelHelper={vehicle.wheelInfo.wheelHelper}
      />
    </group>
  )
}

const Chassis = forwardRef(({ geo, mat, position, scale, mass, chassisHelper }, ref) => {
  const b = geo.boundingBox.max
  const chassisShape = [b.x * scale, b.y, b.z * scale]

  // eslint-disable-next-line
  const [_, api] = useBox(
    () => ({
      mass: mass,
      allowSleep: false,
      args: chassisShape,
      position: position
    }),
    chassisHelper,
    ref
  )
  const cubeRef = useRef()
  const spotLight = useRef()

  useLayoutEffect(() => {
    spotLight.current.target = cubeRef.current
  })

  return (
<mesh name="Chassis" ref={ref} api={api} geometry={geo} material={mat} castShadow>
       <spotLight ref={spotLight} position={[0, 0, 0]} angle={0.6} penumbra={0} intensity={0.8} distance={30} color="#FDEFD3"  />
      <mesh visible={false} ref={cubeRef} position={[0, 0, -5]}>
        <boxBufferGeometry />
        <meshLambertMaterial color="hotpink" />
      </mesh>
    </mesh>
  )
})



const Wheel = forwardRef(({ radius, mass, visible, wheelHelper }, ref) => {
  const wheelShape = [radius, radius, 0.5, 16]
  useCylinder(
    () => ({
      mass: mass,
      type: 'Kinematic',
      material: 'wheel',
      collisionFilterGroup: 0, // turn off collisions
      args: wheelShape
    }),
    wheelHelper,
    ref
  )
  return (
    <group visible={visible} ref={ref}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderBufferGeometry args={wheelShape} />
        <meshNormalMaterial />
      </mesh>
    </group>
  )
})

export default Vehicle
