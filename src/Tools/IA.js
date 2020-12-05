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

function TargetMesh(props) {
  const [ref] = useYuka({ type: GameEntity, name: 'Target', position: [0, 10, 5] })
  useFrame((state, delta) => {
    console.log(state.clock);
  }
   )
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
  const [target, setTarget] = useState([0,25,0])
  const navMesh = useNavLoader('/navmesh_applied.glb');
  const region = navMesh.getRandomRegion();

         useEffect(()=> {
        if(typeof region !== 'undefined') {
            setTarget(region.centroid)
    
        }
    }, [region]) 

  const behavior = new SeekBehavior(targetIA)

  return (
    <Manager behavior={behavior}>
      <VehicleMesh />
      <TargetMesh />
    </Manager>
  )
}


    