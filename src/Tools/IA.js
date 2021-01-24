import { useGLTF } from '@react-three/drei'
import React from 'react'
import { SeekBehavior, Vector3 } from 'yuka'
import { Manager, useYuka } from '../hooks/useYuka'
import Budie from '../references/Budie'
import useStore from '../store'
import {Cube} from '../references/Cube'
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

//react + yuka
//https://codesandbox.io/embed/yuka-seek-demo-with-react-three-fiber-bys2i?codemirror=1 
//react + yuka + pathfinding
//https://codesandbox.io/s/react-three-fiber-yuka-pathfinding-ic4fg?file=/src/state.js:721-746


function TargetMesh(props) {
  const [ref] = useYuka({ type: 'GameEntity', name: 'Target', position: props.position})
  
  return (
    <mesh ref={ref}>
      <sphereBufferGeometry attach="geometry" args={[1]} />
      <meshBasicMaterial color={0xff0000} attach="material" />
    </mesh>
  )
}

export const IA = () => {
  return (
    <Manager>
            <Budie position={[-55,0,77]} />
      <TargetMesh />
    </Manager>
  )
}
