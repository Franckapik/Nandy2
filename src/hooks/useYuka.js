import React, { useRef, useEffect, useState, useContext, createContext } from 'react'
import { useFrame } from 'react-three-fiber'
import { GameEntity, EntityManager, SeekBehavior, Vector3 } from 'yuka'
import useStore from '../store'
  
  const context = createContext()
    
  export function Manager({ children, behavior }) {
    const [mgr] = useState(() => new EntityManager(), [])
    useStore.setState({ IAManager: mgr })
    const IAManager = useStore(state=> state.IAManager)
    useEffect(() => {
      const vehicle = IAManager.entities.find((item) => item.name === 'Vehicle')
      const target = IAManager.entities.find((item) => item.name === 'Target')
      vehicle.steering.add(behavior)
        console.log(IAManager);
    }, [IAManager.entities])
  
    useFrame((state, delta) => IAManager.update(delta))
  
    return children
  }
  
  export function useYuka({
    type = GameEntity,
    position = [0, 0, 0],
    name = 'unnamed'
  }) {
    const ref = useRef()
    const mgr = useStore(state => state.IAManager)
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
    }, [])
    return [ref, entity]
  }
  