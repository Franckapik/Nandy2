import React, { useRef, useEffect, useState, useContext, createContext } from 'react'
import { useFrame } from 'react-three-fiber'
import { GameEntity, EntityManager, SeekBehavior, Vector3, Vehicle } from 'yuka'
import useStore from '../store'
import { useNavLoader } from './useNavLoader'

const context = createContext()

export function Manager({ children, behavior }) {
  const [navMesh, random] = useNavLoader('/navmesh_applied.glb', 10000)

  const [mgr] = useState(() => new EntityManager(), [])
  useStore.setState({ IAManager: mgr })
  const IAManager = useStore((state) => state.IAManager)
  console.log(IAManager);
  useEffect(() => {
    console.log(IAManager);
    const vehicle = IAManager.entities.find((item) => item.name === 'Vehicle')
    const target = IAManager.entities.find((item) => item.name === 'Target')
    const behavior2 = new SeekBehavior(target.position)
    if(vehicle) {
      vehicle.steering.add(behavior2)
    }
    target.position.set(random.x, random.y, random.z)
  }) //no dependencies

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

function generateTarget(target) {
  const radius = 2
  const phi = Math.acos(2 * Math.random() - 1)
  const theta = Math.random() * Math.PI * 2

  if (target) {
    target.position.fromSpherical(radius, phi, theta)
  }

  setTimeout(() => generateTarget(target), 3000)
}

export function useYuka({ type = GameEntity, position = [0, 0, 0], name = 'unnamed' }) {
  const ref = useRef({position : [0,0,0]})
  switch (type) {
    case 'Vehicle':
      type = Vehicle 
      break;
  
    default:
      type = GameEntity
      break;
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
  }, [])

  return [ref, entity]
}
