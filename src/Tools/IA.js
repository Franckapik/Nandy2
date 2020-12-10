import { useGLTF } from '@react-three/drei'
import React from 'react'
import { SeekBehavior, Vector3 } from 'yuka'
import { Manager, useYuka } from '../hooks/useYuka'
import Budie from '../references/Budie'
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

/* function VehicleMesh(props) {
  const [ref] = useYuka({ type: 'Vehicle', name: 'Vehicle' })
  const { nodes, materials } = useGLTF('remorque.gltf', '/draco/')

  return <mesh ref={ref} geometry={nodes.Remorque.geometry} />
  
} */

function TargetMesh(props) {
  const [ref] = useYuka({ type: 'GameEntity', name: 'Target' })

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
<Budie position={[-55,0,77]} />
      <TargetMesh />
    </Manager>
  )
}
