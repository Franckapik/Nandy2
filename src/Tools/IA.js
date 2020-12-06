import { useGLTF } from '@react-three/drei'
import React from 'react'
import { SeekBehavior, Vector3 } from 'yuka'
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
  const [ref] = useYuka({ type: 'Vehicle', name: 'Vehicle' })
  const { nodes, materials } = useGLTF('remorque.gltf', '/draco/')

  return <mesh ref={ref} geometry={nodes.Remorque.geometry} />
  
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

//ne pas compter sur useFrame mais plutot setInterval pour genererune position ts les x sec ? 


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
      <VehicleMesh />
      <TargetMesh />
    </Manager>
  )
}
