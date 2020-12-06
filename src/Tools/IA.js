import React, { useEffect, useState } from 'react'
import { useFrame, useUpdate } from 'react-three-fiber'
import { GameEntity, SeekBehavior, Vector3, Vehicle } from 'yuka'
import { useNavLoader } from '../hooks/useNavLoader'
import { Manager, useYuka } from '../hooks/useYuka'
import useStore from '../store'

//steering behavior :
/* ArriveBehavior
FleeBehavior
FlockingBehavior
FollowPathBehavior
InterposeBehavior
ObstacleAvoidanceBehavior
OffsetPursuitBehavior
PursuitBehavior
SeekBehavior
WanderBehavior */

function VehicleMesh(props) {
  const [ref] = useYuka({ type: Vehicle, name: 'Vehicle' })

  return (
    <mesh ref={ref}>
      <coneBufferGeometry ref={useUpdate((geometry) => geometry.rotateX(Math.PI * 0.5), [])} attach="geometry" args={[2, 2, 8]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}

/* const FlowerGen = (props) => {

  function setFlowerPos(min, max) {
    let plusOrMinus = Math.random() < 0.5 ? -1 : 1
    let distance = (Math.random() * (max - min) + min).toFixed(2) * plusOrMinus
    return distance
  }

  const [count, setCount] = useState([0, 0, 0])
  const [randomTime, setTime] = useState(5)

  const min = 5
  const max = 20

  let elapsed = 0
  useFrame(({ clock }, delta) => {
    if (elapsed >= randomTime) {
      setTime(Math.random() * (max - min) + min);
      let randomPos = [setFlowerPos(2, 5), 0, setFlowerPos(2, 5)]
      const chassisPos = useStore.getState().cameraTarget //get Store once
      let offset = new Vector3(...randomPos);
      let flowerPos = new Vector3();
      let chassisV = new Vector3(...chassisPos)
      flowerPos.copy(chassisV).add(offset)
      setCount((oldArr) => [...oldArr, [flowerPos.x,flowerPos.y,flowerPos.z]])
      elapsed = 0
    } else {
      elapsed += delta
    }
  })

  return count.map((a, i) => {
    return <Cube key={i} position={a} />
  })
} */

function TargetMesh(props) {
  const [ref] = useYuka({ type: GameEntity, name: 'Target' })
  const [randomTime, setTime] = useState(5)
  const [target, setTarget] = useState([0, 25, 0])

  let elapsed = 0
  let time = 5

  const navMesh = useNavLoader('/navmesh_applied.glb')
  const region = navMesh.getRandomRegion()

  useEffect(() => {
    if (typeof region !== 'undefined') {
      setTarget(region.centroid)
    }
  }, [region])

  useFrame((state, delta) => {
    if (elapsed >= time) {
      ref.current.position.x += 5
      console.log(ref.current.position)
      elapsed = 0
    } else {
      elapsed += delta
    }
  })
  return (
    <mesh ref={ref}>
      <sphereBufferGeometry attach="geometry" args={[0.5]} />
      <meshBasicMaterial color={0xff0000} attach="material" />
    </mesh>
  )
}

export const IA = () => {
  const t = useStore((state) => state.targetIA)
  const targetIA = new Vector3(...t)

  const behavior = new SeekBehavior(targetIA)

  return (
    <Manager behavior={behavior}>
      <VehicleMesh />
      <TargetMesh />
    </Manager>
  )
}
