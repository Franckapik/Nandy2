import React from 'react'
import { useUpdate } from 'react-three-fiber'
import { Vehicle, GameEntity, SeekBehavior } from 'yuka'
import { Manager, useYuka } from '../hooks/useYuka'
import useStore from '../store'
import { Vector3 } from 'three'

function VehicleMesh(props) {
  const [ref] = useYuka({ type: Vehicle, name: 'Vehicle' })

  return (
    <mesh ref={ref}>
      <coneBufferGeometry ref={useUpdate((geometry) => geometry.rotateX(Math.PI * 0.5), [])} attach="geometry" args={[2, 2, 8]} />
      <meshNormalMaterial attach="material" />
    </mesh>
  )
}

function TargetMesh(props) {
  const [ref] = useYuka({ type: GameEntity, name: 'Target', position: [0, 10, 5] })

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
