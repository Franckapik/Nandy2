import { useEffect, useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import { EntityManager, FollowPathBehavior, GameEntity, NavMeshLoader, OnPathBehavior, SeekBehavior, Vehicle } from 'yuka'
import useStore from '../store'
import {useNavmesh} from './useNavmesh'
import { useRandom } from './useRandom'

export const Manager = ({ children, behavior }) => {
  const [targetPos, setPos] = useState()
  const [random] = useRandom('/navmesh.glb', 'NavMesh', 50) //origin navmesh to world origin on blender

  const [mgr] = useState(() => new EntityManager(), [])
  useStore.setState({ IAManager: mgr })
  const IAManager = useStore((state) => state.IAManager)
  const target = IAManager.entities.find((item) => item.name === 'Target')
  const vehicle = IAManager.entities.find((item) => item.name === 'Vehicle')

  const [navMesh] = useNavmesh('/navmesh.glb')
  console.log(navMesh);


  useEffect(() => {
    if (vehicle) {
      vehicle.maxSpeed = 5;
      const followPathBehavior = new FollowPathBehavior()
      const onPathBehavior = new OnPathBehavior()  
      followPathBehavior.active = false
      onPathBehavior.active = false
      onPathBehavior.radius = 0.01  

      const behavior = new SeekBehavior(targetPos)
      vehicle.steering.add(followPathBehavior)
      vehicle.steering.add(onPathBehavior)

/*       findPathTo(vehicle, targetPos)

      function findPathTo(vehicle, target) {
        const from = vehicle.position
        const to = target
  
        const path = navMesh.findPath(from, to)
  
        onPathBehavior.active = true
        onPathBehavior.path.clear()
        followPathBehavior.active = true
        followPathBehavior.path.clear()
  
        for (const point of path) {
          followPathBehavior.path.add(point)
          onPathBehavior.path.add(point)
        }
      } */

    }
  }, [targetPos]) //no dependencies

  let elapsed = 0
  let interval = 3

  useFrame((state, delta) => {
    if (elapsed >= interval) {
      const randomArr = random[Math.floor(Math.random() * random.length)]
      target.position.set(randomArr[0], randomArr[1], randomArr[2])
      setPos(target.position)
      elapsed = 0
    } else {
      elapsed += delta
    }
    IAManager.update(delta)
  })

  return children
}

export const useYuka = ({ type = GameEntity, position = [0, 0, 0], name = 'unnamed', ...props }) => {
  const ref = useRef()
  switch (type) {
    case 'Vehicle':
      type = Vehicle
      break

    default:
      type = GameEntity
      break
  }
  const mgr = useStore((state) => state.IAManager)
  const [entity] = useState(() => new type())
  useEffect(() => {
    entity.position.set(...position)
    entity.name = name
    entity.setRenderComponent(ref, (entity) => {
      ref.current.position.copy(entity.position)
      ref.current.quaternion.copy(entity.rotation)
    })
    mgr.add(entity)
    return () => mgr.remove(entity)
  }, [position])

  return [ref, entity]
}
