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

  //le hook useYuka creer un ref qui est juste un obj.current
  //le ref.position et quaternions sont modifiés selon l'entité rendue.
  //pour la target qui change, j'ai constaté l'utilisation du useStore.subscribe pour changer modificer les parametres du comportement selon la nouvelle position (trigerring )
  //possible de tester d'abord dans le manager puis ensuite de l'exporter ailleurs.
  //setInterval function dans un hook avec le navmesh avec le temps en parametre. 
  //intéret du GameEntity ? setRenderComponent? 
  //le ref permets de controler le component => reflechir pour le vehicle.
  //tte modification du ref se situe dans le hook useYukafinalement.
  //le cycle d'un hook est rendu via le useEffect avec ou sans parametre de rafraichissement.

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
  