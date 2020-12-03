import { useGLTF } from '@react-three/drei'
import React, { useRef, useState, useEffect } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'

import * as THREE from 'three'

export default function Budie(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('./budie.gltf')
  console.log(animations[0])
  const actions = useRef()
  const [mixer] = useState(() => new THREE.AnimationMixer())
  useFrame((state, delta) => mixer.update(delta))
  useEffect(() => {
    actions.current = {
      Marche: mixer.clipAction(animations[0], group.current)
    }
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])

  useEffect(() => {
    actions.current.Marche.play()
    return null
  }, [])

  console.log(actions.current)

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.Body} />
      <primitive object={nodes.HancheL} />
      <primitive object={nodes.HancheR} />
      <skinnedMesh material={materials.beige} 
      geometry={nodes.BudieMesh.geometry} 
      skeleton={nodes.BudieMesh.skeleton} 
      onClick={() => console.log('oui')} />
    </group>
  )
}
