import React, { useRef, useEffect, useState, useContext, createContext } from 'react'
import { useFrame } from 'react-three-fiber'
import { GameEntity, EntityManager, SeekBehavior, Vector3, Vehicle } from 'yuka'
import useStore from '../store'
import { useRandom } from './useRandom'
import { useRandomFromNavmesh } from './useRandomFromNavmesh'

const context = createContext()

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


export function Manager({ children, behavior }) {
  /*   setTimeout(() => generateTarget(target), 3000)
   */
  const [targetPos, setPos] = useState()
  const [random] = useRandom('/navmesh.glb', 'NavMesh', 50)

  const [mgr] = useState(() => new EntityManager(), [])
  useStore.setState({ IAManager: mgr })
  const IAManager = useStore((state) => state.IAManager)
  const target = IAManager.entities.find((item) => item.name === 'Target')
  const vehicle = IAManager.entities.find((item) => item.name === 'Vehicle')


  useEffect(() => {
    if (random.length) {
      const behavior2 = new SeekBehavior(targetPos)
      if (vehicle) {
        vehicle.steering.add(behavior2)
      }
    }
  }, [targetPos]) //no dependencies

  let elapsed = 0
  let interval = 8

  useFrame((state, delta) =>{ 
    if (elapsed >= interval) {
      const randomArr = random[Math.floor(Math.random() * random.length)]
      target.position.set(randomArr[0], randomArr[1], randomArr[2])
      setPos(target.position)
      console.log(targetPos);

      elapsed = 0
    } else {
      elapsed += delta
    }


    IAManager.update(delta)})

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
