import React, { useRef, useEffect, useState, useContext, createContext } from 'react'
import { useFrame } from 'react-three-fiber'
import { GameEntity, EntityManager, SeekBehavior, Vector3, Vehicle } from 'yuka'
import useStore from '../store'
import { useRandom } from './useRandom'
import { useRandomFromNavmesh } from './useRandomFromNavmesh'

const context = createContext()

export function Manager({ children, behavior }) {
  /*   setTimeout(() => generateTarget(target), 3000)
   */
  const [random] = useRandom('/navmesh.glb', 'NavMesh', 50)

  const [mgr] = useState(() => new EntityManager(), [])
  useStore.setState({ IAManager: mgr })
  const IAManager = useStore((state) => state.IAManager)

  useEffect(() => {
    if (random.length) {
      const vehicle = IAManager.entities.find((item) => item.name === 'Vehicle')
      const target = IAManager.entities.find((item) => item.name === 'Target')
      const randomArr = random[Math.floor(Math.random() * random.length)]
      target.position.set(randomArr[0], randomArr[1], randomArr[2])
      const behavior2 = new SeekBehavior(target.position)
      if (vehicle) {
        console.log('ici')
        vehicle.steering.add(behavior2)
      }
    }
  }, [random]) //no dependencies

  useFrame((state, delta) => IAManager.update(delta))

  return children
}

function generateTarget(target) {
  const radius = 2
  const phi = Math.acos(2 * Math.random() - 1)
  const theta = Math.random() * Math.PI * 2

  if (target) {
    target.position.fromSpherical(radius, phi, theta)
  }

  setTimeout(() => generateTarget(target), 3000)
}

export function useYuka({ type = GameEntity, position = [0, 0, 0], name = 'unnamed', ...props }) {
  const ref = useRef()
  console.log(position);
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
