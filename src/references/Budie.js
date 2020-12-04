import { useGLTF } from '@react-three/drei'
import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'


export default function Budie(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('./budie.gltf')
  const actions = useRef()
  const [mixer] = useState(() => new THREE.AnimationMixer())
  useFrame((state, delta) => mixer.update(delta))
  useEffect(() => {
    actions.current = {
      Marche: mixer.clipAction(animations[0], group.current)
    }
    return () => animations.forEach((clip) => mixer.uncacheClip(clip))
  }, [])

  /*   useEffect(() => {
    actions.current.Marche.play()
    return null
  }, []) */

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.Body} />
      <primitive object={nodes.HancheL} />
      <primitive object={nodes.HancheR} />
      <skinnedMesh
        onClick={() => {
          actions.current.Marche.play()
          console.log('Marche!')
        }}
        material={materials.beige}
        geometry={nodes.BudieMesh.geometry}
        skeleton={nodes.BudieMesh.skeleton}
      />
    </group>
  )
}
